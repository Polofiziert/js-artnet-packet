/**
 * Buffer Serializer
 * Converts packets to/from Buffer format
 */

const Serializer = require('./Serializer');
const PacketParser = require('../parser/PacketParser');

class BufferSerializer extends Serializer {
  /**
   * Serialize a packet object to Buffer
   * @param {Object} packet - The packet object (must have toBuffer method)
   * @returns {Buffer}
   */
  serialize(packet) {
    if (!packet || typeof packet.toBuffer !== 'function') {
      throw new Error("Packet must have toBuffer() method");
    }

    return packet.toBuffer();
  }

  /**
   * Deserialize a Buffer into a packet object
   * @param {Buffer} buffer - The buffer to deserialize
   * @returns {Object} Packet object
   */
  deserialize(buffer) {
    if (!Buffer.isBuffer(buffer)) {
      throw new Error("Data must be a Buffer");
    }

    return PacketParser.parse(buffer);
  }
}

module.exports = BufferSerializer;
