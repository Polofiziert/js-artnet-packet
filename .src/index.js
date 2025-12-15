/**
 * Art-Net 4 Protocol Library
 * Main entry point
 */

// Constants
const Constants = require('./constants');

// Packets
const Packets = require('./packets');

// Parser
const { PacketParser } = require('./parser');

// Serializers
const { Serializer, BufferSerializer, JsonSerializer } = require('./serializers');

// Network
const { Transceiver } = require('./network');

// Facade
module.exports = {
  // Core
  Constants,
  Packets,

  // Specific packet types (convenience imports)
  ArtNetPoll: Packets.ArtNetPoll,
  ArtNetPollReply: Packets.ArtNetPollReply,
  ArtNetDMX: Packets.ArtNetDMX,
  ArtNetSync: Packets.ArtNetSync,

  // Utilities
  PacketParser,
  Serializer,
  BufferSerializer,
  JsonSerializer,
  Transceiver,

  // Version
  version: '0.1.0',
};
