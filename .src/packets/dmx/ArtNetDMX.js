/**
 * ArtNetDMX Packet (OpCode: 0x5000)
 * Transmits DMX512 data over Art-Net
 */

const { ArtNetPacket } = require('../base');
const { OpCodes, DMX_CHANNELS, SEQUENCE_DISABLE } = require('../../constants');

class ArtNetDMX extends ArtNetPacket {
  /**
   * @param {number} sequence - Sequence number (0-255, 0 = disabled)
   * @param {number} physical - Physical input port (0-3)
   * @param {number} universe - DMX universe (0-32767)
   * @param {Buffer} dmxData - DMX data (512 bytes)
   */
  constructor(sequence = SEQUENCE_DISABLE, physical = 0, universe = 0, dmxData = null) {
    super(OpCodes.OUTPUT);
    
    this.sequence = sequence;
    this.physical = physical;
    this.universe = universe;
    this.dmxLength = DMX_CHANNELS; // Always 512
    this.dmxData = dmxData || Buffer.alloc(DMX_CHANNELS);
  }

  /**
   * Convert packet to Buffer
   * @returns {Buffer} Serialized packet (530 bytes)
   */
  toBuffer() {
    const buffer = Buffer.alloc(530);
    let offset = this.writeCommonHeader(buffer, 0);

    // Sequence (1 byte)
    buffer.writeUInt8(this.sequence, offset++);

    // Physical (1 byte)
    buffer.writeUInt8(this.physical, offset++);

    // Universe (2 bytes, little-endian)
    buffer.writeUInt16LE(this.universe, offset);
    offset += 2;

    // DMX Data Length (2 bytes, big-endian)
    buffer.writeUInt16BE(this.dmxLength, offset);
    offset += 2;

    // DMX512 Data (512 bytes)
    this.dmxData.copy(buffer, offset);
    offset += DMX_CHANNELS;

    return buffer;
  }

  /**
   * Parse buffer into ArtNetDMX packet
   * @param {Buffer} buffer - The buffer to parse
   * @returns {ArtNetDMX}
   */
  static fromBuffer(buffer) {
    if (buffer.length < 530) {
      throw new Error("Buffer too small for ArtNetDMX packet (minimum 530 bytes)");
    }

    const packet = new ArtNetDMX();
    let offset = packet.readCommonHeader(buffer, 0);

    packet.sequence = buffer.readUInt8(offset++);
    packet.physical = buffer.readUInt8(offset++);
    packet.universe = buffer.readUInt16LE(offset);
    offset += 2;

    packet.dmxLength = buffer.readUInt16BE(offset);
    offset += 2;

    packet.dmxData = Buffer.from(buffer.slice(offset, offset + DMX_CHANNELS));

    return packet;
  }

  /**
   * Get packet size
   * @returns {number}
   */
  getSize() {
    return 530;
  }

  /**
   * Set DMX channel value (0-indexed)
   * @param {number} channel - Channel number (0-511)
   * @param {number} value - Channel value (0-255)
   */
  setChannel(channel, value) {
    if (channel < 0 || channel >= DMX_CHANNELS) {
      throw new Error(`Channel out of range: ${channel} (0-${DMX_CHANNELS - 1})`);
    }
    if (value < 0 || value > 255) {
      throw new Error(`Channel value out of range: ${value} (0-255)`);
    }
    this.dmxData[channel] = value;
  }

  /**
   * Get DMX channel value (0-indexed)
   * @param {number} channel - Channel number (0-511)
   * @returns {number}
   */
  getChannel(channel) {
    if (channel < 0 || channel >= DMX_CHANNELS) {
      throw new Error(`Channel out of range: ${channel} (0-${DMX_CHANNELS - 1})`);
    }
    return this.dmxData[channel];
  }

  /**
   * Set multiple DMX channels at once
   * @param {number} startChannel - Starting channel (0-indexed)
   * @param {Uint8Array|Buffer|Array} values - Channel values
   */
  setChannels(startChannel, values) {
    for (let i = 0; i < values.length; i++) {
      this.setChannel(startChannel + i, values[i]);
    }
  }

  /**
   * Clear all DMX data (set to 0)
   */
  clear() {
    this.dmxData.fill(0);
  }

  /**
   * Enable sequence tracking
   * @param {number} sequence - Sequence number (1-255)
   */
  enableSequence(sequence = 1) {
    if (sequence < 1 || sequence > 255) {
      throw new Error("Sequence must be 1-255");
    }
    this.sequence = sequence;
  }

  /**
   * Disable sequence tracking
   */
  disableSequence() {
    this.sequence = SEQUENCE_DISABLE;
  }
}

module.exports = ArtNetDMX;
