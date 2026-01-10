const {Buffer} = require('node:buffer')
const dgram = require('node:dgram')

const {toBinString, toBinStringPretty, toHexStringPretty, toHexString, toHexStringArray} = require('../helper');
const {MappedBitfield, FixedString, MappedEnum} = require('./packets/schemas/fieldTypeExtention')
const {ArtNetCodes} = require("./codes")
const {tranceiver} = require("./network/tranceiver")

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

        if(options.socket){
            let socketInfo = options.socket.address()

            options.socket = options.socket
            options.host = socketInfo.address
            options.port = socketInfo.port
            
            let transreiver = new tranceiver(options)
            return transreiver
        }else{
            let socket = dgram.createSocket('udp4')
            options.socket = socket
            let transreiver = new tranceiver(options)
            return transreiver
        }
    }
    
}


module.exports = {
    jap
}