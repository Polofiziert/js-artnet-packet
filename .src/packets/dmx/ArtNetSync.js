/**
 * ArtNetSync Packet (OpCode: 0x2300)
 * Used to synchronize multiple ArtDmx packets for synchronized output
 */

const { ArtNetPacket } = require('../base');
const { OpCodes } = require('../../constants');

class ArtNetSync extends ArtNetPacket {
  /**
   * @param {number} aux1 - Auxiliary byte 1 (default: 0)
   * @param {number} aux2 - Auxiliary byte 2 (default: 0)
   */
  constructor(aux1 = 0, aux2 = 0) {
    super(OpCodes.SYNC);
    this.aux1 = aux1;
    this.aux2 = aux2;
  }

  /**
   * Convert packet to Buffer
   * @returns {Buffer} Serialized packet (14 bytes)
   */
  toBuffer() {
    const buffer = Buffer.alloc(14);
    let offset = this.writeCommonHeader(buffer, 0);

    // Aux1 (1 byte)
    buffer.writeUInt8(this.aux1, offset++);

    // Aux2 (1 byte)
    buffer.writeUInt8(this.aux2, offset++);

    return buffer;
  }

  /**
   * Parse buffer into ArtNetSync packet
   * @param {Buffer} buffer - The buffer to parse
   * @returns {ArtNetSync}
   */
  static fromBuffer(buffer) {
    if (buffer.length < 14) {
      throw new Error("Buffer too small for ArtNetSync packet (minimum 14 bytes)");
    }

    const packet = new ArtNetSync();
    let offset = packet.readCommonHeader(buffer, 0);

    packet.aux1 = buffer.readUInt8(offset++);
    packet.aux2 = buffer.readUInt8(offset++);

    return packet;
  }

  /**
   * Get packet size
   * @returns {number}
   */
  getSize() {
    return 14;
  }
}

module.exports = ArtNetSync;
