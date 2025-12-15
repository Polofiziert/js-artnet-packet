/**
 * JSON Serializer
 * Converts packets to/from JSON format (for debugging/logging)
 */

const Serializer = require('./Serializer');

class JsonSerializer extends Serializer {
  /**
   * Serialize a packet object to JSON string
   * @param {Object} packet - The packet object
   * @returns {string} JSON string
   */
  serialize(packet) {
    if (!packet) {
      throw new Error("Packet cannot be null");
    }

    const obj = this.packetToObject(packet);
    return JSON.stringify(obj, null, 2);
  }

  /**
   * Convert packet object to plain JavaScript object
   * @param {Object} packet - The packet object
   * @returns {Object}
   */
  packetToObject(packet) {
    const obj = {
      type: packet.constructor.name,
      opCode: `0x${packet.opCode.toString(16).padStart(4, "0")}`,
    };

    // Add protocol version if present
    if (typeof packet.protVerHi !== 'undefined') {
      obj.protVer = {
        hi: packet.protVerHi,
        lo: packet.protVerLo,
      };
    }

    // Add all other properties
    for (const [key, value] of Object.entries(packet)) {
      if (key === 'id' || key === 'opCode' || key === 'protVerHi' || key === 'protVerLo') {
        continue;
      }

      if (Buffer.isBuffer(value)) {
        // Convert buffer to hex string
        obj[key] = `<Buffer ${value.toString('hex')}>`;
      } else if (Array.isArray(value)) {
        obj[key] = value;
      } else if (typeof value === 'object') {
        obj[key] = value;
      } else {
        obj[key] = value;
      }
    }

    return obj;
  }

  /**
   * Deserialize from JSON
   * Note: This is limited since we can't reconstruct typed packet objects from JSON
   * @param {string} jsonString - The JSON string
   * @returns {Object} Plain object
   */
  deserialize(jsonString) {
    if (typeof jsonString !== 'string') {
      throw new Error("Data must be a JSON string");
    }

    try {
      return JSON.parse(jsonString);
    } catch (err) {
      throw new Error(`Invalid JSON: ${err.message}`);
    }
  }
}

module.exports = JsonSerializer;
