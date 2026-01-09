//const r = require('restructure');
const {toBinString, toBinStringPretty, toHexStringPretty, toHexString, toHexStringArray} = require('./helper');
const {Buffer} = require('node:buffer')
const {MappedBitfield, FixedString, MappedEnum} = require('./src/packets/schemas/fieldTypeExtention')
const {pollReplySchema} = require('./src/packets/schemas/opPollReply')
const dgram = require('node:dgram')
const {ArtNetCodes} = require("./src/codes")
const { PollReplyPacket } = require("./src/packets/pollReplyPacket")
const { PollPacket } = require("./src/packets/pollPacket")

const client = dgram.createSocket('udp4');
const os = require('node:os')

// -----------------------------------

var packet = new PollPacket


//console.log(packet)
console.log("------------------------")
console.log(toHexStringArray(packet.encode()))