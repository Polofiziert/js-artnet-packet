/**
 * Packet Parser
 * Identifies and parses incoming Art-Net packets
 */

const { OpCodes } = require('../../constants');

// Packet imports
const { ArtNetPoll, ArtNetPollReply } = require('../../packets/discovery');
const { ArtNetDMX, ArtNetSync } = require('../../packets/dmx');

class PacketParser {
  /**
   * Parse a buffer into an Art-Net packet object
   * @param {Buffer} buffer - The buffer to parse
   * @returns {Object} The parsed packet object
   * @throws {Error} If buffer is invalid or packet type unknown
   */
  static parse(buffer) {
    if (!buffer || buffer.length < 10) {
      throw new Error("Buffer too small (minimum 10 bytes)");
    }

    // Check Art-Net ID
    const id = buffer.toString("ascii", 0, 7);
    if (id !== "Art-Net") {
      throw new Error("Invalid Art-Net ID");
    }

    // Get OpCode
    const opCode = buffer.readUInt16LE(8);

    // Parse based on OpCode
    const packetMap = {
      [OpCodes.POLL]: ArtNetPoll,
      [OpCodes.POLL_REPLY]: ArtNetPollReply,
      [OpCodes.OUTPUT]: ArtNetDMX,
      [OpCodes.SYNC]: ArtNetSync,
      // More opcodes can be added here
    };

    const PacketClass = packetMap[opCode];
    if (!PacketClass) {
      throw new Error(`Unknown or unsupported OpCode: 0x${opCode.toString(16).padStart(4, "0")}`);
    }

    try {
      return PacketClass.fromBuffer(buffer);
    } catch (err) {
      throw new Error(`Failed to parse ${PacketClass.name}: ${err.message}`);
    }
  }

  /**
   * Identify the OpCode from a buffer without full parsing
   * @param {Buffer} buffer - The buffer to examine
   * @returns {number} The OpCode
   */
  static identify(buffer) {
    if (!buffer || buffer.length < 10) {
      throw new Error("Buffer too small to identify (minimum 10 bytes)");
    }

    const id = buffer.toString("ascii", 0, 7);
    if (id !== "Art-Net") {
      throw new Error("Invalid Art-Net ID");
    }

    return buffer.readUInt16LE(8);
  }

  /**
   * Get the OpCode name for debugging
   * @param {number} opCode - The OpCode value
   * @returns {string}
   */
  static getOpCodeName(opCode) {
    const names = {
      [OpCodes.POLL]: "ArtNetPoll",
      [OpCodes.POLL_REPLY]: "ArtNetPollReply",
      [OpCodes.OUTPUT]: "ArtNetDMX",
      [OpCodes.SYNC]: "ArtNetSync",
    };

    return names[opCode] || `Unknown (0x${opCode.toString(16).padStart(4, "0")})`;
  }

  /**
   * Check if buffer contains valid Art-Net packet header
   * @param {Buffer} buffer - The buffer to check
   * @returns {boolean}
   */
  static isArtNetPacket(buffer) {
    if (!buffer || buffer.length < 10) {
      return false;
    }

    const id = buffer.toString("ascii", 0, 7);
    return id === "Art-Net";
  }
}

module.exports = PacketParser;
