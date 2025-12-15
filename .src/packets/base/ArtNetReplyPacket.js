/**
 * Base Art-Net Reply Packet Class
 * For packets that DO NOT include ProtVerHi and ProtVerLo fields
 * (e.g., ArtPollReply, ArtIpProgReply)
 */

const ARTNET_ID = "Art-Net\0"; // 8 bytes: "Art-Net" + null terminator

class ArtNetReplyPacket {
  /**
   * @param {number} opCode - The operation code for this packet
   */
  constructor(opCode) {
    this.id = ARTNET_ID;
    this.opCode = opCode;
    // Explicitly NO ProtVerHi and ProtVerLo fields
  }

  /**
   * Write the common header (ID + OpCode only, no ProtVer) to buffer
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

    // Note: NO ProtVerHi/ProtVerLo for reply packets

    return offset;
  }

  /**
   * Read the common header from buffer (no ProtVer)
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

    // Note: NO ProtVerHi/ProtVerLo for reply packets

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
   * @returns {ArtNetReplyPacket} Parsed packet instance
   */
  static fromBuffer(buffer) {
    throw new Error("fromBuffer() must be implemented by subclass");
  }

  /**
   * Get packet size in bytes (must be implemented by subclass)
   * @returns {number}
   */
  getSize() {
    throw new Error("getSize() must be implemented by subclass");
  }
}

module.exports = ArtNetReplyPacket;
