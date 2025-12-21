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


class ArtNetInstance {
    constructor(complient = 1, discover = 1, logLevel = "debug"){
        this.complient = complient
        this.discover = discover
        this.logLevel = logLevel
        this.devProperties = {
            shortName: "js-artnet-package",
            longName: "js-artnet-package jep!",
            estaMan: "0.1",
            oem: "0.1",
            artnetVersInfo: "4.48",     // Version of the used Art-Net Protocol Revision
            devVersionInfo: "0.1",        // Version of the Device Firmware
            ubeaVersion: 0,             // Version of User edited Bios
            portSum: 1,           // number of output ports, if you have a hardware device
            style: "stController",      // type of your device
        }
    }

    init(){


    }

    bind(socket){
        this.socket = socket
    }

}