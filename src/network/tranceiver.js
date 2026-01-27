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
        options.socket ? this.socket = options.socket : null
        options.host ? this.host = options.host : null
        options.port ? this.port = options.port : null
        this.ownsSocket = options.ownsSocket

        this.receiving = false 
    }

    close(){
        log("close called")
        
        if(this.ownsSocket){
            this.socket.removeAllListeners('message')
            this.socket.removeAllListeners('error')
            this.socket.removeAllListeners('close')
            this.socket.close()
            this.receiving = false
        }else{
            this.socket.removeListener('message', this._msgHandler())
            this.socket.removeListener('error', this._errorHandler())
            this.socket.removeListener('close', this._closeHandler())
            this.receiving = false
        }
        this.emit('close')
        log("closed")
    }
    

    bind(){ // socket starts receiving packets sent to that local port/address (including any remote sender). 
        // take socket and make connectionand start receivinf messages
        log('bind called')

        if(this.ownsSocket){
            log('bind owns Socket')
            // this.socket.on('message', this._msgHandler())
            this.socket.on('error', this._errorHandler())
            this.socket.on('close', this._closeHandler())
            this.socket.bind({
                address: this.host,
                port: this.port,
            }, ()=>{
                this.emit('listening')
                this.receiving = true
            })
        }else{
            log('bind doesn`t owns Socket')
            try{
                let sockInfo = this.socket.address()

                this.host = sockInfo.address
                this.port = sockInfo.port

                this.socket.on('message', this._msgHandler())
                this.socket.on('error', this._errorHandler())
                this.socket.on('close', this._closeHandler())
                this.receiving = true
            }catch(e){
                this.emit('error', e)
            }
        }
        log('Bind func ended')
    }   

    send(type, obj){
        log("send called")

        if(this.receiving){
            //this.socket.send(msg)
        }else{
            log(`not Receiving`)
            this.emit('error')
        }

        // this.emit('send')
        // this.emit('artPoll', {packet: "artPoll"})
        // this.emit('artPollReply', {packet: "artPollReply"})
        // this.emit('error', {test: "a test Obj"})
    }

    _msgHandler(msg, rinfo){
        log(`Message received: ${msg} \n From: ${rinfo}`)
    }
    _errorHandler(err){
        log(`Error emitted: ${err}`)
    }
    _closeHandler(){
        log(`Closed emitted`)
    }
}

module.exports = {
    tranceiver
}