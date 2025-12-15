/**
 * ArtNetPollReply Packet (OpCode: 0x2101)
 * Response from a node to an ArtNetPoll
 * NOTE: This packet does NOT include ProtVerHi and ProtVerLo fields
 */

const { ArtNetReplyPacket } = require('../base');
const { OpCodes } = require('../../constants');

class ArtNetPollReply extends ArtNetReplyPacket {
  /**
   * @param {string} ipAddress - Node IP address (default: "0.0.0.0")
   * @param {string} nodeShortName - Short node name (max 17 chars, default: "")
   * @param {string} nodeLongName - Long node name (max 63 chars, default: "")
   */
  constructor(ipAddress = "0.0.0.0", nodeShortName = "", nodeLongName = "") {
    super(OpCodes.POLL_REPLY);
    
    this.ipAddress = ipAddress;
    this.port = 0x1936; // Always 0x1936 (6454)
    this.versInfoHi = 0; // Firmware high byte
    this.versInfoLo = 0; // Firmware low byte
    this.netSwitch = 0;
    this.subSwitch = 0;
    this.bindIndex = 0;
    
    this.nodeShortName = nodeShortName.substring(0, 17);
    this.nodeLongName = nodeLongName.substring(0, 63);
    
    this.numPorts = 4;
    this.portTypes = [0xc0, 0xc0, 0xc0, 0xc0]; // Input/Output
    this.goodInput = [0x80, 0x80, 0x80, 0x80];
    this.goodOutput = [0x80, 0x80, 0x80, 0x80];
    this.goodOutputB = [0x80, 0x80, 0x80, 0x80];
    
    this.status1 = 0x00;
    this.status2 = 0x00;
    
    this.oem = 0x00;
    this.ubea = 0x00;
  }

  /**
   * Convert packet to Buffer
   * @returns {Buffer} Serialized packet (239 bytes)
   */
  toBuffer() {
    const buffer = Buffer.alloc(239);
    let offset = this.writeCommonHeader(buffer, 0);

    // IP Address[4] (4 bytes) - goes directly after OpCode (no ProtVer!)
    const ipParts = this.ipAddress.split(".");
    for (let i = 0; i < 4; i++) {
      buffer.writeUInt8(parseInt(ipParts[i]) || 0, offset++);
    }

    // Port (2 bytes, little-endian)
    buffer.writeUInt16LE(this.port, offset);
    offset += 2;

    // VersInfoHi, VersInfoLo (2 bytes)
    buffer.writeUInt8(this.versInfoHi, offset++);
    buffer.writeUInt8(this.versInfoLo, offset++);

    // NetSwitch (1 byte)
    buffer.writeUInt8(this.netSwitch, offset++);

    // SubSwitch (1 byte)
    buffer.writeUInt8(this.subSwitch, offset++);

    // OEM (2 bytes, big-endian)
    buffer.writeUInt16BE(this.oem, offset);
    offset += 2;

    // UBEA (1 byte)
    buffer.writeUInt8(this.ubea, offset++);

    // Status (1 byte)
    buffer.writeUInt8(this.status1, offset++);

    // ESTA/MAC (6 bytes, not implemented for now)
    offset += 6;

    // BindIndex (1 byte)
    buffer.writeUInt8(this.bindIndex, offset++);

    // NumPorts (1 byte)
    buffer.writeUInt8(this.numPorts, offset++);

    // Port Types (4 bytes)
    for (let i = 0; i < 4; i++) {
      buffer.writeUInt8(this.portTypes[i], offset++);
    }

    // Good Input (4 bytes)
    for (let i = 0; i < 4; i++) {
      buffer.writeUInt8(this.goodInput[i], offset++);
    }

    // Good Output (4 bytes)
    for (let i = 0; i < 4; i++) {
      buffer.writeUInt8(this.goodOutput[i], offset++);
    }

    // Swout (4 bytes)
    for (let i = 0; i < 4; i++) {
      buffer.writeUInt8(0x00, offset++);
    }

    // SwIn (4 bytes)
    for (let i = 0; i < 4; i++) {
      buffer.writeUInt8(0x00, offset++);
    }

    // Status2 (1 byte)
    buffer.writeUInt8(this.status2, offset++);

    // Filler (3 bytes)
    offset += 3;

    // Node Short Name (18 bytes, null-terminated)
    buffer.write(this.nodeShortName, offset, 18, "ascii");
    offset += 18;

    // Node Long Name (64 bytes, null-terminated)
    buffer.write(this.nodeLongName, offset, 64, "ascii");
    offset += 64;

    // Report (64 bytes)
    offset += 64;

    // NumPortsHi (1 byte)
    buffer.writeUInt8(0x00, offset++);

    // Good OutputB (4 bytes)
    for (let i = 0; i < 4; i++) {
      buffer.writeUInt8(this.goodOutputB[i], offset++);
    }

    return buffer;
  }

  /**
   * Parse buffer into ArtNetPollReply packet
   * @param {Buffer} buffer - The buffer to parse
   * @returns {ArtNetPollReply}
   */
  static fromBuffer(buffer) {
    if (buffer.length < 239) {
      throw new Error("Buffer too small for ArtNetPollReply packet (minimum 239 bytes)");
    }

    const packet = new ArtNetPollReply();
    let offset = packet.readCommonHeader(buffer, 0);

    // IP Address[4] (no ProtVer before this!)
    const ipParts = [];
    for (let i = 0; i < 4; i++) {
      ipParts.push(buffer.readUInt8(offset++));
    }
    packet.ipAddress = ipParts.join(".");

    packet.port = buffer.readUInt16LE(offset);
    offset += 2;

    packet.versInfoHi = buffer.readUInt8(offset++);
    packet.versInfoLo = buffer.readUInt8(offset++);

    packet.netSwitch = buffer.readUInt8(offset++);
    packet.subSwitch = buffer.readUInt8(offset++);

    packet.oem = buffer.readUInt16BE(offset);
    offset += 2;

    packet.ubea = buffer.readUInt8(offset++);
    packet.status1 = buffer.readUInt8(offset++);

    // ESTA/MAC (6 bytes)
    offset += 6;

    packet.bindIndex = buffer.readUInt8(offset++);
    packet.numPorts = buffer.readUInt8(offset++);

    // Port Types
    for (let i = 0; i < 4; i++) {
      packet.portTypes[i] = buffer.readUInt8(offset++);
    }

    // Good Input
    for (let i = 0; i < 4; i++) {
      packet.goodInput[i] = buffer.readUInt8(offset++);
    }

    // Good Output
    for (let i = 0; i < 4; i++) {
      packet.goodOutput[i] = buffer.readUInt8(offset++);
    }

    return packet;
  }

  /**
   * Get packet size
   * @returns {number}
   */
  getSize() {
    return 239;
  }

  /**
   * Get firmware version as string
   * @returns {string}
   */
  getFirmwareVersion() {
    return `${this.versInfoHi}.${this.versInfoLo}`;
  }

  /**
   * Set firmware version
   * @param {number} hi - High byte
   * @param {number} lo - Low byte
   */
  setFirmwareVersion(hi, lo) {
    this.versInfoHi = hi;
    this.versInfoLo = lo;
  }
}

module.exports = ArtNetPollReply;
