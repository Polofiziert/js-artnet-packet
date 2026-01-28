const {Buffer} = require('node:buffer')
const dgram = require('node:dgram')

const {toBinString, toBinStringPretty, toHexStringPretty, toHexString, toHexStringArray, checkIp} = require('../helper');
const {MappedBitfield, FixedString, MappedEnum} = require('./packets/schemas/fieldTypeExtention')
const {ArtNetCodes} = require("./codes")
const {tranceiver} = require("./network/tranceiver")
const { ArtNetConfigurationError } = require('./errors/config.error')

const util = require('util');
const log = util.debuglog('jap');


class jap {
    constructor(){
        this.id = "Art-Net"
    }

    /*
    Creates or uses a given socket to initiate an transreceiver obs
    options = {
        socket: socket, // optional
        host: "2.0.0.102", // ignored if socket is given, used to create a socket
        port: 6454, // ignored if socket is given, used to create a socket
    }
    */
    createArtNetProtocol (options) {
        log("creating Protocol transreceiver")

        if (!options) {
            throw new ArtNetConfigurationError(1001, "createArtNetProtocol",
                "Options not set. expected: {socket} or {host, port}");
        }

        if (options.socket) {
            // socket provided — fine
        } else {
            if (!options.host || options.port == null) {
                throw new ArtNetConfigurationError(1002, "createArtNetProtocol",
                    "Options not set correct! expected: {host, port}");
            }
            if (!checkIp(options.host)) {
                throw new ArtNetConfigurationError(1003, "createArtNetProtocol",
                    "IpAddress not set correct! expected: {host:x.x.x.x}");
            }
            if (!Number.isInteger(options.port) || options.port < 0 || options.port > 65535) {
                throw new ArtNetConfigurationError(1004, "createArtNetProtocol",
                    "Port not set correct! expected: 0-65535");
            }
        }


        if(options.socket){
            options.ownsSocket = false
            let transreiver = new tranceiver(options)
            return transreiver
        }else{
            let socket = dgram.createSocket('udp4')
            options.socket = socket
            options.ownsSocket = true
            let transreiver = new tranceiver(options)
            return transreiver
        }
    }
    
}


module.exports = {
    jap
}