const dgram = require('node:dgram')

const socket = dgram.createSocket('udp4')
const EventEmitter = require('node:events')
const { Buffer } = require('node:buffer')
const os = require('node:os')
const {} = require('./src/constants/constants')
const { PacketParser } = require('./src/parser/packetParser')
const packetParser = new PacketParser()
const { DmxPacket } = require('./src/packets/dmxPacket')
const { PollPacket } = require('./src/packets/pollPacket')
const { PollReplyPacket } = require('./src/packets/pollReplyPacket')
const { ArtNetPackets } = require('./src/packets/packets')
const { ArtNetTransportError } = require('./src/errors/transport.error')
const {
    toBinString,
    toBinStringPretty,
    toHexStringPretty,
} = require('./helper')

const util = require('util')
const log = util.debuglog('packetDmxTest')

const { dmxSchema } = require('./src/packets/schemas/opDmx')

const array = [
    0x41, 0x72, 0x74, 0x2d, 0x4e, 0x65, 0x74, 0x00, 0x00, 0x50, 0x04, 0x30, 0x01, 0x00, 0x10, 0x00, 0x00, 0x04, 0x64, 0x02, 0x64, 0x02
]

const buffer = Buffer.from(array)
console.log('Buffer', buffer)

// let packet = new DmxPacket()

//console.log('Dmx Packet: ', packet)

data = dmxSchema.fromBuffer(buffer)

// packet.decode(buffer)

// let parsedPacket = packetParser.parse(msg)

console.log('Packet Data: ', data)
