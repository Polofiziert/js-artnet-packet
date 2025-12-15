/**
 * All Art-Net packet types exported
 */

// Base classes
const { ArtNetPacket, ArtNetReplyPacket } = require('./base');

// Discovery
const { ArtNetPoll, ArtNetPollReply } = require('./discovery');

// DMX Transport
const { ArtNetDMX, ArtNetSync } = require('./dmx');

// TODO: Add more packet types as they are implemented
// const { ArtNetAddress, ... } = require('./config');
// const { ArtNetTodRequest, ... } = require('./rdm');

module.exports = {
  // Base classes
  ArtNetPacket,
  ArtNetReplyPacket,

  // Discovery
  ArtNetPoll,
  ArtNetPollReply,

  // DMX
  ArtNetDMX,
  ArtNetSync,
};
