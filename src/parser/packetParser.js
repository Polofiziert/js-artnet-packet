/*
PacketParser
Identifies the packet type (OpCode)
Routes to appropriate packet class
Calls decode() on that class
Returns typed packet instance
*/

const { ArtNetCodes } = require('../codes/')
const { ArtNetPacketError } = require('../errors/packet.error')

const { PollPacket } = require('../packets/pollPacket')
const { PollReplyPacket } = require('../packets/pollReplyPacket')
const { DmxPacket } = require('../packets/dmxPacket')

const util = require('util')
const log = util.debuglog('parser')

class PacketParser {
    constructor() {}

    parse(buffer) {
        log('parse func called')
        if (this.isArtnet(buffer)) {
            let opCode = buffer.readInt16LE(8)
            opCode = ArtNetCodes.getOpCodeByCode(opCode)

            log('Parsing opCode: ', opCode)

            switch (opCode) {
                case 'OpPoll':
                    log('opPoll')
                    let pollPacket = new PollPacket()
                    pollPacket.decode(buffer)
                    return pollPacket
                case 'OpPollReply':
                    log('opPollReply')
                    let pollReplyPacket = new PollReplyPacket()
                    pollReplyPacket.decode(buffer)
                    return pollReplyPacket
                case 'OpDmx':
                    log('opDmx')
                    let dmxPacket = new DmxPacket()
                    dmxPacket.decode(buffer)
                    log('opDmx: decoded Buffer: ', dmxPacket)
                    return dmxPacket
                default:
                    return { err: '', msg: buffer }
            }
        } else {
            let wrongTypeError = new ArtNetPacketError(
                3001,
                'jap.parser.parse',
                'unkown artnet packet type given for parsing'
            )
            return { err: wrongTypeError, msg: buffer }
        }
    }

    isArtnet(buffer) {
        let isArtnet = false
        let artnetId = buffer.toString('utf8', 0, 7)

        artnetId == 'Art-Net' ? (isArtnet = true) : null

        return isArtnet
    }
}

module.exports = {
    PacketParser,
}
