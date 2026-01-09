const {toBinString, toBinStringPretty, toHexStringPretty} = require('../helper');
const {Buffer} = require('node:buffer')
const {MappedBitfield, FixedString, MappedEnum} = require('./packets/schemas/fieldTypeExtention')
const {pollReplySchema} = require('./packets/schemas/opPollReply')
const dgram = require('node:dgram')
const {ArtNetCodes} = require("./codes")
const { PollReplyPacket } = require("./packets/pollReplyPacket")
const { PollPacket } = require("./packets/pollPacket")

const client = dgram.createSocket('udp4');
const os = require('node:os')


class jap {
    constructor(options){

    }

    creatcreateArtNetProtocol ({socket}) {
        
    }
    
}