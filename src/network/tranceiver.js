const dgram = require('node:dgram')
const socket = dgram.createSocket('udp4');
const EventEmitter = require('node:events');
const os = require('node:os')
const {} =require("../constants/constants")
const { packetParser } = require("../parser/packetParser")
// Sends and Receives UPD trafic
// calls parser
// emmits packet Event

// discovery sends artPolls and sends artPollReplys

class tranceiver extends EventEmitter {
    constructor(socket, port = ARTNET_PORT, address = "0.0.0.0", broadcast = ARTNET_BROADCAST) {
        super();

        this.port = port;
        this.address = address;
        this.broadcast = broadcast;
        this.socket = null;
        this.isListening = false;
    }

    listen(){
        this.socket.on('message', (msg, rinfo)=>{
            const packet = packetParser.parse(msg)
            switch (packet.opCode) {
                case "OpPoll":
                    this.emit('OpPoll', {"packet": packet, "rinfo": rinfo})
                case "OpPollReply":
                    this.emit('OpPollReply', {"packet": packet, "rinfo": rinfo})
                default:
                    this.emit("error", {err: "unkown opCode", msg: {"packet": msg, "rinfo": rinfo}})
            }
        });
    }

    send(packet, address){
        let buffer = packet.encode()
        let port = this.port
        this.socket.send(buffer, port, address, (err) => {
            return err
        });
    }
}