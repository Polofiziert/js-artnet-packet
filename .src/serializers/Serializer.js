/**
 * Base Serializer interface
 */

class Serializer {
  /**
   * Serialize a packet object to another format
   * @param {Object} packet - The packet object
   * @returns {*} Serialized data
   */
  serialize(packet) {
    throw new Error("serialize() must be implemented by subclass");
  }

  /**
   * Deserialize data into a packet object
   * @param {*} data - The data to deserialize
   * @returns {Object} Packet object
   */
  deserialize(data) {
    throw new Error("deserialize() must be implemented by subclass");
  }
}

module.exports = Serializer;
