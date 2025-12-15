const { Buffer } = require('node:buffer');
const {ArtNetConstants} = require('../lib/constants');
const {AT_OPCODES, AT_REPORT_CODES, AT_STYLE_CODES, AT_OEM_CODES} = require('../lib/codes');


const buf = Buffer.alloc(24)
const buffer = buf
const id = buf.write(ArtNetConstants.AT_ID)
const opCode = buf.writeUInt16LE(AT_OPCODES[0].code, id)
//const protVerHi = buf.writeUInt8(ArtNetConstants.AT_PROT_VER_HI, opCode)
//const protVerLo = buf.writeUInt8(ArtNetConstants.AT_PROT_VER_LO, protVerHi)

const offset = 3

if(buffer.toString('utf8', offset, offset+8) == "Art-Net\0"){
    // ID (8 bytes)
    var id2 = buffer.toString('utf8', offset, offset+8);

    // opCode (2 bytes)
    var opCode2 = buffer.readUInt16LE(8);
}else{
    throw new Error("Art-Net ID (Art-Net) not found in Packet, ID Found: " + buffer.toString('utf8', offset, offset+8) + " ;")
}

console.log(id2 + " id")
console.log(opCode2 + " opCode")

console.log(buf)