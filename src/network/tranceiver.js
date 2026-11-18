const dgram = require('node:dgram')

const socket = dgram.createSocket('udp4')
const EventEmitter = require('node:events')
const os = require('node:os')
const {} = require('../constants/constants')
const { PacketParser } = require('../parser/packetParser')
const packetParser = new PacketParser()
const { DmxPacket } = require('../packets/dmxPacket')
const { PollPacket } = require('../packets/pollPacket')
const { PollReplyPacket } = require('../packets/pollReplyPacket')
const { ArtNetPackets } = require('../packets/packets')
const { ArtNetTransportError } = require('../errors/transport.error')
const {
    toBinString,
    toBinStringPretty,
    toHexStringPretty,
    toHexStringArray,
} = require('../../helper')

const util = require('util')
const log = util.debuglog('protocol')

// Sends and Receives UPD trafic
// calls parser
// emmits packet Event

// discovery sends artPolls and sends artPollReplys

/*
Events:
- artPoll
- artDmx

- message
- close
- bind
- error
*/

class protocol extends EventEmitter {
    constructor(options) {
        super()
        options.socket ? (this.socket = options.socket) : null
        options.host ? (this.host = options.host) : null
        options.port ? (this.port = options.port) : null
        this.ownsSocket = options.ownsSocket

        this.receiving = false

        this._boundMsgEmitHandler = this._msgEmitHandler.bind(this)
        this._boundErrorEmitHandler = this._errorEmitHandler.bind(this)
        this._boundCloseEmitHandler = this._closeEmitHandler.bind(this)
    }

    close() {
        log('Close func called')

        if (this.ownsSocket) {
            this.socket.close()
        } else {
            this.socket.off('message', this._boundMsgEmitHandler)
            this.socket.off('error', this._boundErrorEmitHandler)
            this.socket.off('close', this._boundCloseEmitHandler)
            this.receiving = false
            this.emit('close')
        }
        log('Close func ended')
    }

    bind() {
        // take socket and make connection and start receiving messages
        log('Bind func called')
        if (this.receiving) {
            // Emits Error when allready bound.
            // TODO: Maybe add a "this.binding" variable so only one function call runns at a time?
            // TODO: this.binding would be only used when grossly negligent use from the User....
            log('Allready Bound / Receiving')
            throw new ArtNetTransportError(
                2001,
                'artnetProtocol.bind',
                'Protocol is already bound'
            )
        } else {
            // Looks if socket is given or self created
            if (this.ownsSocket) {
                // when socket selfcreated registers listeners and binds the port to given address and port
                log(`Bind owns Socket| Host: ${this.host}; Port: ${this.port}`)
                try {
                    this.socket.on('message', this._boundMsgEmitHandler) // TODO: msg Handling
                    this.socket.on('error', this._boundErrorEmitHandler)
                    this.socket.on('close', this._boundCloseEmitHandler)

                    this.socket.bind(
                        {
                            address: this.host,
                            port: this.port,
                        },
                        () => {
                            // TODO: Error Handling?
                            this.receiving = true
                            this.emit('listening')
                            return true
                        }
                    )
                } catch (e) {
                    this.emit('error', e)
                    return e
                }
            } else {
                // when socket is given, just registers listeners to socket
                log('Bind doesn`t owns Socket')
                try {
                    let sockInfo = this.socket.address()

                    this.host = sockInfo.address
                    this.port = sockInfo.port

                    this.socket.on('message', this._boundMsgEmitHandler)
                    this.socket.on('error', this._boundErrorEmitHandler)
                    this.socket.on('close', this._boundCloseEmitHandler)
                    this.receiving = true
                } catch (e) {
                    this.emit('error', e)
                    return e
                }
                this.emit('listening')
                return true
            }
        }

        log('Bind func ended')
    }

    send(type, ipAddress, options) {
        log('Send func called')

        if (this.receiving) {
            log(
                `SendFunc: Receiving, can send: ${this.port} to ${ipAddress} from ${this.host}`
            )
            let data
            let packet

            if (options instanceof ArtNetPackets) {
                log('SendFunc: Got Art-Net packet: ', options.data.opCode)
                data = options.encode()
            } else {
                switch (type) {
                    case 'artDmx':
                        log('SendFunc: Got DMX options')
                        packet = new DmxPacket()

                        packet.data.net = options.portAddress.net
                        packet.data.subUni = options.portAddress.subNet
                        packet.data.data = options.data
                        data = packet.encode()
                        break
                    case 'artPoll':
                        log('SendFunc: Got POLL options')
                        packet = new PollPacket()

                        packet.data = Object.assign(packet.data, options) // merges the options into the data
                        data = packet.encode()
                        break
                    case 'artPollReply':
                        log('SendFunc: Got POLL_REPLY options')
                        packet = new PollReplyPacket()

                        packet.data = Object.assign(packet.data, options) // merges the options into the data
                        data = packet.encode()
                        break
                    default:
                        log('Error SendFunc: unkown type')
                        let wrongTypeError = new ArtNetTransportError(
                            2003,
                            'artnetProtocol.send',
                            'unkown artnet packet type'
                        )
                        this.emit('error', wrongTypeError)
                        return 0
                }
            }

            //log("SendFunc: packet encode: ", "\n" + toHexStringPretty(data))
            this.socket.send(data, this.port, ipAddress)
            return 1
        } else {
            log(`SendFunc: not Receiving, cant send`)
            let notBoundError = new ArtNetTransportError(
                2002,
                'artnetProtocol.send',
                'Protocol is not bound!'
            )
            this.emit('error', notBoundError)
        }
    }

    _msgEmitHandler(msg, rinfo) {
        log(`msgEmitHandler: msg call received From: ${rinfo.address}, ${rinfo.port}`)
        log("msgEmit: ", toHexStringArray(msg))
        try {
            let parsedPacket = packetParser.parse(msg)
            this.emit('message', parsedPacket, rinfo)
        } catch (e) {
            this.emit('message', msg, rinfo)
        }
    }
    _errorEmitHandler(err) {
        log(`Error emited: ${err}`)
        this.emit('error', err)
    }
    _closeEmitHandler() {
        this.receiving = false
        this.emit('close')
        log(`Close emited`)
    }
}

module.exports = {
    protocol,
}
