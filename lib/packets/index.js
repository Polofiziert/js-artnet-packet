const ArtPollPacket  = require('./opPoll/poll');
const ArtPollReplyPacket  = require('./opPoll/poll-reply');


module.exports = {
  ...ArtPollPacket,
  ...ArtPollReplyPacket,
};

