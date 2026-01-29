const dgram = require('node:dgram')

const socket = dgram.createSocket('udp4');
const EventEmitter = require('node:events');
const os = require('node:os')
const {} =require("../constants/constants")
const { packetParser } = require("../parser/packetParser");

const util = require('util');
const log = util.debuglog('protocol');


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
        log("Close func called")
        
        if(this.ownsSocket){
            this.socket.close()
        }else{
            this.socket.removeListener('message', this._msgEmitHandler)
            this.socket.removeListener('error', this._errorEmitHandler)
            this.socket.removeListener('close', this._closeEmitHandler.bind(this))
            this.receiving = false
            this.emit('close')
        }
        log("Close func ended")
    }
    

    bind(){ // socket starts receiving packets sent to that local port/address (including any remote sender). 
        // take socket and make connectionand start receivinf messages
        log('Bind func called')
        if(this.receiving){
            // TODO: Emit Error
            log('Allready Bound / Receiving')
        } else {
            if(this.ownsSocket){
                log('Bind owns Socket')
                try{
                    // this.socket.on('message', this._msgHandler()) // TODO: msg Handling
                    this.socket.on('error', this._errorEmitHandler.bind(this))
                    this.socket.on('close', this._closeEmitHandler.bind(this))

                    this.socket.bind({
                        address: this.host,
                        port: this.port,
                    }, ()=>{ // TODO: Error Handling?
                        this.receiving = true
                        this.emit('listening')
                    })
                }catch(e){
                    this.emit('error', e)
                }

            }else{
                log('Bind doesn`t owns Socket')
                try{
                    let sockInfo = this.socket.address()

                    this.host = sockInfo.address
                    this.port = sockInfo.port

                    this.socket.on('message', this._msgEmitHandler.bind(this))
                    this.socket.on('error', this._errorEmitHandler.bind(this))
                    this.socket.on('close', this._closeEmitHandler.bind(this))
                    this.receiving = true
                }catch(e){
                    this.emit('error', e)
                    return
                }
                this.emit('listening')
            }
        }

        log('Bind func ended')
    }   

    send(type, obj){
        log("Send func called")

        if(this.receiving){
            //this.socket.send(msg)
            log(`Receiving, can send`)
        }else{
            log(`not Receiving, cant send`)
            this.emit('error')
        }

        // this.emit('send')
        // this.emit('artPoll', {packet: "artPoll"})
        // this.emit('artPollReply', {packet: "artPollReply"})
        // this.emit('error', {test: "a test Obj"})
    }

    _msgEmitHandler(msg, rinfo){
        log(`Message emit received: ${msg} \n From: ${rinfo}`)
        this.emit('message', msg, rinfo)
    }
    _errorEmitHandler(err){
        log(`Error emited: ${err}`)
        this.emit('error', err)
    }
    _closeEmitHandler(){
        this.receiving = false
        this.emit('close')
        log(`Close emited`)
    }
}

module.exports = {
    tranceiver
}