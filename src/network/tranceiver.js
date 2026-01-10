const dgram = require('node:dgram')

const socket = dgram.createSocket('udp4');
const EventEmitter = require('node:events');
const os = require('node:os')
const {} =require("../constants/constants")
const { packetParser } = require("../parser/packetParser");

const util = require('util');
const log = util.debuglog('rxTx');


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

class tranceiver extends EventEmitter{
    constructor(options){
        super()
        this.socket = options.socket
        this.host = options.host
        this.port = options.port
    }
    
    // connect(){ // set a default remote address/port for outgoing packets and restrict incoming packets to only those from that remote.
    //     this.emit('connect')
    // }

    close(){
        log("close called")
        this.emit('close')
    }
    

    bind(){ // socket starts receiving packets sent to that local port/address (including any remote sender). 
        // take socket and make connectionand start receivinf messages
        log('bound')
        this.emit('listening')
    }

    send(type, obj){
        log("send called")
        this.emit('send')
        this.emit('artPoll', {packet: "artPoll"})
        this.emit('artPollReply', {packet: "artPollReply"})
        this.emit('error', {test: "a test Obj"})
    }
}

module.exports = {
    tranceiver
}