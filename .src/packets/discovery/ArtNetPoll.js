/**
 * ArtNetPoll Packet (OpCode: 0x2000)
 * Used by controllers to discover nodes on the network
 */

const { ArtNetPacket } = require('../base');
const { OpCodes } = require('../../constants');

class ArtNetPoll extends ArtNetPacket {
  /**
   * @param {number} flags - Behavior flags (default: 0)
   * @param {number} priority - Diagnostic priority (default: 0)
   */
  constructor(flags = 0, priority = 0) {
    super(OpCodes.POLL);
    this.flags = flags;
    this.priority = priority;
  }

  /**
   * Convert packet to Buffer
   * @returns {Buffer} Serialized packet (14 bytes minimum)
   */
  toBuffer() {
    const buffer = Buffer.alloc(14);
    let offset = this.writeCommonHeader(buffer, 0);

    // Flags (1 byte)
    buffer.writeUInt8(this.flags, offset++);

    // Priority (1 byte)
    buffer.writeUInt8(this.priority, offset++);

    return buffer;
  }

  /**
   * Parse buffer into ArtNetPoll packet
   * @param {Buffer} buffer - The buffer to parse
   * @returns {ArtNetPoll}
   */
  static fromBuffer(buffer) {
    if (buffer.length < 14) {
      throw new Error("Buffer too small for ArtNetPoll packet (minimum 14 bytes)");
    }

    const packet = new ArtNetPoll();
    let offset = packet.readCommonHeader(buffer, 0);

    packet.flags = buffer.readUInt8(offset++);
    packet.priority = buffer.readUInt8(offset++);

    return packet;
  }

  /**
   * Get packet size
   * @returns {number}
   */
  getSize() {
    return 14;
  }

  /**
   * Get flag value
   * @param {number} bit - Bit position (0-7)
   * @returns {boolean}
   */
  getFlag(bit) {
    return Boolean((this.flags >> bit) & 1);
  }

  /**
   * Set flag value
   * @param {number} bit - Bit position (0-7)
   * @param {boolean} value - Flag value
   */
  setFlag(bit, value) {
    if (value) {
      this.flags |= (1 << bit);
    } else {
      this.flags &= ~(1 << bit);
    }
  }

  /**
   * Enable/disable targeted mode (bit 0)
   * @param {boolean} enabled
   */
  setTargetedMode(enabled) {
    this.setFlag(0, enabled);
  }

  /**
   * Enable/disable VLC transmission (bit 1)
   * @param {boolean} enabled
   */
  setVlcTransmission(enabled) {
    this.setFlag(1, !enabled); // Note: 1 = disable, 0 = enable
  }
}

module.exports = ArtNetPoll;
