/**
 * Base Art-Net Packet Class
 * For packets that include ProtVerHi and ProtVerLo fields
 */

const ARTNET_ID = "Art-Net\0"; // 8 bytes: "Art-Net" + null terminator

class ArtNetPacket {
  /**
   * @param {number} opCode - The operation code for this packet
   * @param {number} protVerHi - Protocol version high byte (default: 0)
   * @param {number} protVerLo - Protocol version low byte (default: 14 for Art-Net 4)
   */
  constructor(opCode, protVerHi = 0, protVerLo = 14) {
    this.id = ARTNET_ID;
    this.opCode = opCode;
    this.protVerHi = protVerHi;
    this.protVerLo = protVerLo;
  }

  /**
   * Write the common header (ID + OpCode + ProtVer) to buffer
   * @param {Buffer} buffer - The buffer to write to
   * @param {number} offset - The offset to start writing
   * @returns {number} The new offset after writing
   */
  writeCommonHeader(buffer, offset = 0) {
    // ID (8 bytes)
    buffer.write(this.id, offset, 8, "ascii");
    offset += 8;

    // OpCode (2 bytes, little-endian)
    buffer.writeUInt16LE(this.opCode, offset);
    offset += 2;

    // Protocol Version (2 bytes)
    buffer.writeUInt8(this.protVerHi, offset++);
    buffer.writeUInt8(this.protVerLo, offset++);

    return offset;
  }

  /**
   * Read the common header from buffer
   * @param {Buffer} buffer - The buffer to read from
   * @param {number} offset - The offset to start reading from
   * @returns {number} The new offset after reading
   */
  readCommonHeader(buffer, offset = 0) {
    // Skip ID (8 bytes)
    offset += 8;

    // OpCode (2 bytes, little-endian)
    this.opCode = buffer.readUInt16LE(offset);
    offset += 2;

    // Protocol Version (2 bytes)
    this.protVerHi = buffer.readUInt8(offset++);
    this.protVerLo = buffer.readUInt8(offset++);

    return offset;
  }

  /**
   * Convert packet to Buffer (must be implemented by subclass)
   * @returns {Buffer} Serialized packet data
   */
  toBuffer() {
    throw new Error("toBuffer() must be implemented by subclass");
  }

  /**
   * Parse buffer into packet (must be implemented by subclass)
   * @param {Buffer} buffer - The buffer to parse
   * @returns {ArtNetPacket} Parsed packet instance
   */
  static fromBuffer(buffer) {
    throw new Error("fromBuffer() must be implemented by subclass");
  }

  /**
   * Validate that ProtVerLo is 14 (Art-Net 4)
   * @returns {boolean}
   */
  isValidProtocolVersion() {
    return this.protVerLo === 14;
  }

  /**
   * Get packet size in bytes (must be implemented by subclass)
   * @returns {number}
   */
  getSize() {
    throw new Error("getSize() must be implemented by subclass");
  }
}

module.exports = ArtNetPacket;
