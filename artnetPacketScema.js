// Art-Net packet schema-driven serializer
// Provides Schema and Packet classes and common packet implementations.

const PROT_VER = 14; // Art-Net protocol revision

const OPCODES = {
	OpPoll: 0x2000,
	OpPollReply: 0x2100,
	OpDiagData: 0x2300,
	OpCommand: 0x2400,
	OpDataRequest: 0x2700,
	OpDataReply: 0x2800,
	OpOutput: 0x5000, // OpDmx
	OpNzs: 0x5100,
	OpSync: 0x5200,
	OpAddress: 0x6000,
	OpInput: 0x7000,
	OpTodRequest: 0x8000,
	OpTodData: 0x8100,
	OpTodControl: 0x8200,
	OpRdm: 0x8300,
	OpRdmSub: 0x8400,
	OpIpProg: 0xf800,
	OpIpProgReply: 0xf900,
};

function writeString(buf, offset, str, length) {
	const bytes = Buffer.from(str || '', 'utf8');
	const n = Math.min(bytes.length, length - 1);
	bytes.copy(buf, offset, 0, n);
	buf[offset + n] = 0x00;
}

function writeUInt(buf, offset, value, bytes, littleEndian = true) {
	if (bytes === 1) buf.writeUInt8(value & 0xff, offset);
	else if (bytes === 2) {
		if (littleEndian) buf.writeUInt16LE(value & 0xffff, offset);
		else buf.writeUInt16BE(value & 0xffff, offset);
	} else if (bytes === 4) {
		if (littleEndian) buf.writeUInt32LE(value >>> 0, offset);
		else buf.writeUInt32BE(value >>> 0, offset);
	}
}

class Schema {
	constructor(fields) {
		this.fields = fields; // array of {name,type,size,optional}
	}

	computeLength(values = {}) {
		let len = 0;
		for (const f of this.fields) {
			if (f.type === 'id') len += f.size;
			else if (f.type === 'string') len += f.size;
			else if (f.type === 'uint8') len += 1;
			else if (f.type === 'uint16') len += 2;
			else if (f.type === 'uint32') len += 4;
			else if (f.type === 'buffer') len += (values[f.name] ? values[f.name].length : f.size || 0);
			else if (f.type === 'array') len += f.size;
			else len += f.size || 0;
		}
		return len;
	}

	toBuffer(opcode, values = {}) {
		const baseId = Buffer.from('Art-Net\0', 'ascii');
		const len = this.computeLength(values) + baseId.length + 2 + 2; // id + opcode(2) + protVer(2)
		const buf = Buffer.alloc(len);
		let off = 0;
		baseId.copy(buf, off); off += baseId.length;
		buf.writeUInt16LE(opcode & 0xffff, off); off += 2;
		// Protocol version - two bytes
		buf.writeUInt8(0, off); off += 1; // ProtVerHi (high byte)
		buf.writeUInt8(PROT_VER, off); off += 1; // ProtVerLo

		for (const f of this.fields) {
			const v = values[f.name];
			if (f.type === 'string') {
				writeString(buf, off, v || '', f.size);
				off += f.size;
			} else if (f.type === 'array' && f.elementType === 'bitfield') {
				const arr = values[f.name] || [];
				for (let i = 0; i < f.size; i++) {
					let byte = 0;
					const el = arr[i] || {};
					for (const sub of f.elementFields) {
						const subValRaw = (el[sub.name] !== undefined) ? el[sub.name] : (values[sub.name] !== undefined ? values[sub.name] : 0);
						let subVal = subValRaw;
						if (sub.mapping && typeof subVal === 'string') {
							const key = subVal.toLowerCase();
							if (sub.mapping[key] !== undefined) subVal = sub.mapping[key];
							else subVal = 0;
						}
						const mask = (1 << (sub.size || 1)) - 1;
						byte |= (subVal & mask) << sub.bit;
					}
					buf[off + i] = byte;
				}
				off += f.size;
			} else if (f.type === 'bitfield') {
				// construct a byte (or multi-byte) from subfields
				let totalBytes = f.size || 1;
				for (let b = 0; b < totalBytes; b++) buf[off + b] = 0;
				const container = values[f.name] || {};
				for (const sub of f.fields) {
					const subValRaw = (container[sub.name] !== undefined) ? container[sub.name] : (values[sub.name] !== undefined ? values[sub.name] : 0);
					let subVal = subValRaw;
					if (sub.mapping && typeof subVal === 'string') {
						const key = subVal.toLowerCase();
						if (sub.mapping[key] !== undefined) subVal = sub.mapping[key];
						else subVal = 0;
					}
					const bit = sub.bit;
					const size = sub.size || 1;
					const mask = (1 << size) - 1;
					const shifted = (subVal & mask) << bit;
					// distribute across bytes
					for (let b = 0; b < totalBytes; b++) {
						const byteShift = b * 8;
						buf[off + b] |= (shifted >>> byteShift) & 0xff;
					}
				}
				off += totalBytes;
			} else if (f.type === 'id') {
				// already wrote ID; skip
				off += f.size;
			} else if (f.type === 'uint8') {
				writeUInt(buf, off, v || 0, 1); off += 1;
			} else if (f.type === 'uint16') {
				writeUInt(buf, off, v || 0, 2); off += 2;
			} else if (f.type === 'uint32') {
				writeUInt(buf, off, v || 0, 4); off += 4;
			} else if (f.type === 'buffer') {
				if (v) v.copy(buf, off);
				off += f.size || (v ? v.length : 0);
			} else if (f.type === 'array') {
				if (Array.isArray(v)) {
					for (let i=0;i<f.size;i++) buf[off+i] = v[i] || 0;
				}
				off += f.size;
			} else {
				off += f.size || 0;
			}
		}
		return buf;
	}
}

class Packet {
	constructor(values = {}) { this.values = values; }
	toBuffer() { throw new Error('toBuffer not implemented'); }
}

// Common packet schemas (partial but extensible)
const Schemas = {
	ArtPoll: new Schema([
		{name:'Flags', type:'bitfield', size:1, fields:[
			{name:'reserved7_6', bit:6, size:2},
			{name:'targeted', bit:5, size:1},
			{name:'disableVlc', bit:4, size:1},
			{name:'diagModeUnicast', bit:3, size:1},
			{name:'sendDiagnostics', bit:2, size:1},
			{name:'replyOnChange', bit:1, size:1},
			{name:'reserved0', bit:0, size:1},
		]},
		{name:'DiagPriority', type:'uint8', size:1},
		{name:'TargetPortAddressTop', type:'uint16', size:2},
		{name:'TargetPortAddressBottom', type:'uint16', size:2},
		{name:'EstaMan', type:'uint16', size:2},
		{name:'Oem', type:'uint16', size:2},
	]),

	ArtPollReply: new Schema([
		{name:'IpAddress', type:'array', size:4},
		{name:'Port', type:'uint16', size:2},
		{name:'VersInfoH', type:'uint8', size:1},
		{name:'VersInfoL', type:'uint8', size:1},
		{name:'NetSwitch', type:'uint8', size:1},
		{name:'SubSwitch', type:'uint8', size:1},
		{name:'Oem', type:'uint16', size:2},
		{name:'UbeaVersion', type:'uint8', size:1},
		{name:'Status1', type:'bitfield', size:1, fields:[
			{name:'indicator', bit:6, size:2, mapping:{unknown:0, locate:1, mute:2, normal:3}},
			{name:'portAddressAuthority', bit:4, size:2, mapping:{unknown:0, frontpanel:1, network:2, unused:3}},
			{name:'reserved3', bit:3, size:1},
			{name:'bootFromRom', bit:2, size:1},
			{name:'rdmCapable', bit:1, size:1},
			{name:'ubeaPresent', bit:0, size:1},
		]},
		{name:'EstaManLo', type:'uint8', size:1},
		{name:'EstaManHi', type:'uint8', size:1},
		{name:'PortName', type:'string', size:18},
		{name:'LongName', type:'string', size:64},
		{name:'NodeReport', type:'string', size:64},
		{name:'NumPortsHi', type:'uint8', size:1},
		{name:'NumPortsLo', type:'uint8', size:1},
		{name:'PortTypes', type:'array', size:4, elementType:'bitfield', elementFields:[
			{name:'output', bit:7, size:1},
			{name:'input', bit:6, size:1},
			{name:'protocol', bit:0, size:6},
		]},
		{name:'GoodInput', type:'array', size:4, elementType:'bitfield', elementFields:[
			{name:'dataReceived', bit:7, size:1},
			{name:'testPackets', bit:6, size:1},
			{name:'sips', bit:5, size:1},
			{name:'textPackets', bit:4, size:1},
			{name:'inputDisabled', bit:3, size:1},
		]},
		{name:'GoodOutputA', type:'array', size:4, elementType:'bitfield', elementFields:[
			{name:'outputActive', bit:7, size:1},
			{name:'testPackets', bit:6, size:1},
			{name:'sips', bit:5, size:1},
			{name:'textPackets', bit:4, size:1},
			{name:'merging', bit:3, size:1},
			{name:'dmxShort', bit:2, size:1},
			{name:'mergeModeLTP', bit:1, size:1},
			{name:'convertFromSacn', bit:0, size:1},
		]},
		{name:'SwIn', type:'array', size:4},
		{name:'SwOut', type:'array', size:4},
		{name:'AcnPriority', type:'uint8', size:1},
		{name:'SwMacro', type:'uint8', size:1},
		{name:'SwRemote', type:'uint8', size:1},
		{name:'Style', type:'uint8', size:1},
		{name:'Mac', type:'array', size:6},
		{name:'BindIp', type:'array', size:4},
		{name:'BindIndex', type:'uint8', size:1},
		{name:'Status2', type:'bitfield', size:1, fields:[
			{name:'rdmControlByArtAddress', bit:7, size:1},
			{name:'outputStyleSwitchable', bit:6, size:1},
			{name:'squawking', bit:5, size:1},
			{name:'canSwitchArtNetSacn', bit:4, size:1},
			{name:'portAddress15bit', bit:3, size:1},
			{name:'dhcpCapable', bit:2, size:1},
			{name:'ipIsDhcp', bit:1, size:1},
			{name:'webSupported', bit:0, size:1},
		]},
		{name:'GoodOutputB', type:'array', size:4, elementType:'bitfield', elementFields:[
			{name:'rdmDisabled', bit:7, size:1},
			{name:'outputStyleContinuous', bit:6, size:1},
			{name:'reserved5', bit:5, size:1},
			{name:'reserved4', bit:4, size:1},
			{name:'reserved3', bit:3, size:1},
			{name:'reserved2', bit:2, size:1},
			{name:'reserved1', bit:1, size:1},
			{name:'reserved0', bit:0, size:1},
		]},
		{name:'Status3', type:'bitfield', size:1, fields:[
			{name:'failsafe0', bit:6, size:2},
			{name:'failsafeProgrammable', bit:5, size:1},
			{name:'llrpSupported', bit:4, size:1},
			{name:'portDirectionSwitchable', bit:3, size:1},
			{name:'rdmnetSupported', bit:2, size:1},
			{name:'backgroundQueueSupported', bit:1, size:1},
			{name:'backgroundDiscoveryDisable', bit:0, size:1},
		]},
		{name:'DefaultRespUID', type:'array', size:6},
		{name:'User', type:'array', size:2},
		{name:'RefreshRate', type:'uint16', size:2},
		{name:'BackgroundQueuePolicy', type:'uint8', size:1},
		{name:'Filler', type:'buffer', size:10},
	]),

	ArtAddress: new Schema([
		{name:'NetSwitch', type:'uint8', size:1},
		{name:'BindIndex', type:'uint8', size:1},
		{name:'PortName', type:'string', size:18},
		{name:'LongName', type:'string', size:64},
		{name:'SwIn', type:'array', size:4},
		{name:'SwOut', type:'array', size:4},
	]),

	ArtDmx: new Schema([
		{name:'Sequence', type:'uint8', size:1},
		{name:'Physical', type:'uint8', size:1},
		{name:'Universe', type:'uint16', size:2},
		{name:'Length', type:'uint16', size:2},
		{name:'Data', type:'buffer', size:0}, // variable
	]),

	ArtIpProg: new Schema([
		{name:'Command', type:'uint8', size:1},
		{name:'ProgIp', type:'array', size:4},
		{name:'ProgSm', type:'array', size:4},
		{name:'ProgPort', type:'uint16', size:2},
		{name:'ProgDg', type:'array', size:3},
	]),

	ArtIpProgReply: new Schema([
		{name:'ProgIp', type:'array', size:4},
		{name:'ProgSm', type:'array', size:4},
		{name:'ProgPort', type:'uint16', size:2},
		{name:'Status', type:'bitfield', size:1, fields:[
			{name:'reserved7', bit:7, size:1},
			{name:'dhcpEnabled', bit:6, size:1},
			{name:'reserved5_0', bit:0, size:6},
		]},
	]),
	ArtDataRequest: new Schema([
		{name:'Prot', type:'uint8', size:1},
		{name:'Address', type:'uint16', size:2},
		{name:'Page', type:'uint8', size:1},
		{name:'Data', type:'buffer', size:0},
	]),
	ArtDataReply: new Schema([
		{name:'Prot', type:'uint8', size:1},
		{name:'Address', type:'uint16', size:2},
		{name:'Page', type:'uint8', size:1},
		{name:'Data', type:'buffer', size:0},
	]),
	ArtNzs: new Schema([
		{name:'Sequence', type:'uint8', size:1},
		{name:'Physical', type:'uint8', size:1},
		{name:'Universe', type:'uint16', size:2},
		{name:'Length', type:'uint16', size:2},
		{name:'Data', type:'buffer', size:0},
	]),
	ArtSync: new Schema([
		{name:'Opcode', type:'uint16', size:2},
	]),
	ArtDiagData: new Schema([
		{name:'Port', type:'uint8', size:1},
		{name:'Data', type:'buffer', size:0},
	]),
	ArtCommand: new Schema([
		{name:'Command', type:'string', size:64},
	]),
	ArtTrigger: new Schema([
		{name:'Pad', type:'uint8', size:1},
		{name:'Key', type:'uint8', size:1},
		{name:'SubKey', type:'uint8', size:1},
		{name:'Pad2', type:'uint8', size:1},
		{name:'Payload', type:'buffer', size:0},
	]),
	ArtInput: new Schema([
		{name:'BindIndex', type:'uint8', size:1},
		{name:'SwIn', type:'array', size:4},
	]),
	ArtTodRequest: new Schema([
		{name:'Command', type:'uint8', size:1},
		{name:'Prot', type:'uint8', size:1},
		{name:'Spare', type:'uint8', size:1},
		{name:'Port', type:'uint8', size:1},
	]),
	ArtTodData: new Schema([
		{name:'BindIndex', type:'uint8', size:1},
		{name:'Port', type:'uint8', size:1},
		{name:'Last', type:'uint8', size:1},
		{name:'Count', type:'uint8', size:1},
		{name:'Data', type:'buffer', size:0},
	]),
	ArtTodControl: new Schema([
		{name:'Command', type:'uint8', size:1},
		{name:'Param', type:'uint8', size:1},
		{name:'Data', type:'buffer', size:0},
	]),
	ArtRdm: new Schema([
		{name:'Data', type:'buffer', size:0},
	]),
	ArtRdmSub: new Schema([
		{name:'Data', type:'buffer', size:0},
	]),
};

// Packet classes
class ArtPoll extends Packet {
	toBuffer() {
		return Schemas.ArtPoll.toBuffer(OPCODES.OpPoll, this.values);
	}
}

class ArtPollReply extends Packet {
	toBuffer() {
		// Ensure Port field default
		if (!this.values.Port) this.values.Port = 0x1936;
		return Schemas.ArtPollReply.toBuffer(OPCODES.OpPollReply, this.values);
	}
}

class ArtAddress extends Packet {
	toBuffer() { return Schemas.ArtAddress.toBuffer(OPCODES.OpAddress, this.values); }
}

class ArtDmx extends Packet {
	toBuffer() {
		const data = this.values.Data || Buffer.alloc(0);
		const length = data.length;
		const protoBase = Buffer.from('Art-Net\0', 'ascii');
		const headerLen = protoBase.length + 2 + 2; // id + opcode + protVer
		const buf = Buffer.alloc(headerLen + 1 + 1 + 2 + 2 + length);
		let off = 0;
		protoBase.copy(buf, off); off += protoBase.length;
		buf.writeUInt16LE(OPCODES.OpOutput, off); off += 2;
		buf.writeUInt8(0, off); off += 1; // ProtVerHi
		buf.writeUInt8(PROT_VER, off); off += 1; // ProtVerLo
		buf.writeUInt8(this.values.Sequence || 0, off); off += 1;
		buf.writeUInt8(this.values.Physical || 0, off); off += 1;
		// Universe low byte, high byte
		buf.writeUInt16LE(this.values.Universe || 0, off); off += 2;
		buf.writeUInt16BE(length, off); off += 2; // high byte first? ArtDmx length transmitted high then low in spec historically; many implementations use big-endian for length. We'll write BE.
		if (length) data.copy(buf, off);
		return buf;
	}
}

class ArtNzs extends Packet {
	toBuffer() {
		const data = this.values.Data || Buffer.alloc(0);
		const length = data.length;
		const protoBase = Buffer.from('Art-Net\0', 'ascii');
		const buf = Buffer.alloc(protoBase.length + 2 + 2 + 1 + 1 + 2 + 2 + length);
		let off = 0;
		protoBase.copy(buf, off); off += protoBase.length;
		buf.writeUInt16LE(OPCODES.OpNzs, off); off += 2;
		buf.writeUInt8(0, off); off +=1;
		buf.writeUInt8(PROT_VER, off); off +=1;
		buf.writeUInt8(this.values.Sequence || 0, off); off +=1;
		buf.writeUInt8(this.values.Physical || 0, off); off +=1;
		buf.writeUInt16LE(this.values.Universe || 0, off); off +=2;
		buf.writeUInt16BE(length, off); off +=2;
		if (length) data.copy(buf, off);
		return buf;
	}
}

class ArtSync extends Packet { toBuffer() { return Schemas.ArtSync.toBuffer(OPCODES.OpSync, this.values); } }
class ArtDataRequest extends Packet { toBuffer() { return Schemas.ArtDataRequest.toBuffer(OPCODES.OpDataRequest, this.values); } }
class ArtDataReply extends Packet { toBuffer() { return Schemas.ArtDataReply.toBuffer(OPCODES.OpDataReply, this.values); } }
class ArtDiagData extends Packet { toBuffer() { return Schemas.ArtDiagData.toBuffer(OPCODES.OpDiagData, this.values); } }
class ArtCommand extends Packet { toBuffer() { return Schemas.ArtCommand.toBuffer(OPCODES.OpCommand, this.values); } }
class ArtTrigger extends Packet { toBuffer() { return Schemas.ArtTrigger.toBuffer(OPCODES.OpTrigger, this.values); } }
class ArtInput extends Packet { toBuffer() { return Schemas.ArtInput.toBuffer(OPCODES.OpInput, this.values); } }
class ArtTodRequest extends Packet { toBuffer() { return Schemas.ArtTodRequest.toBuffer(OPCODES.OpTodRequest, this.values); } }
class ArtTodData extends Packet { toBuffer() { return Schemas.ArtTodData.toBuffer(OPCODES.OpTodData, this.values); } }
class ArtTodControl extends Packet { toBuffer() { return Schemas.ArtTodControl.toBuffer(OPCODES.OpTodControl, this.values); } }
class ArtRdm extends Packet { toBuffer() { return Schemas.ArtRdm.toBuffer(OPCODES.OpRdm, this.values); } }
class ArtRdmSub extends Packet { toBuffer() { return Schemas.ArtRdmSub.toBuffer(OPCODES.OpRdmSub, this.values); } }

class ArtIpProg extends Packet { toBuffer() { return Schemas.ArtIpProg.toBuffer(OPCODES.OpIpProg, this.values); } }
class ArtIpProgReply extends Packet { toBuffer() { return Schemas.ArtIpProgReply.toBuffer(OPCODES.OpIpProgReply, this.values); } }

module.exports = {
	OPCODES,
	Schemas,
	Packet,
	ArtPoll,
	ArtPollReply,
	ArtAddress,
	ArtDmx,
	ArtIpProg,
	ArtIpProgReply,
	ArtDataRequest,
	ArtDataReply,
	ArtNzs,
	ArtSync,
	ArtDiagData,
	ArtCommand,
	ArtTrigger,
	ArtInput,
	ArtTodRequest,
	ArtTodData,
	ArtTodControl,
	ArtRdm,
	ArtRdmSub,
	Schema,
};

