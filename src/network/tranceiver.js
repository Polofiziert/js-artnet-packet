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

        this._boundMsgEmitHandler = this._msgEmitHandler.bind(this)
        this._boundErrorEmitHandler = this._errorEmitHandler.bind(this)
        this._boundCloseEmitHandler = this._closeEmitHandler.bind(this)
    }

    close(){
        log("Close func called")
        
        if(this.ownsSocket){
            this.socket.close()
        }else{
            this.socket.off('message', this._boundMsgEmitHandler)
            this.socket.off('error', this._boundErrorEmitHandler)
            this.socket.off('close', this._boundCloseEmitHandler)
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
            return true
        } else {
            if(this.ownsSocket){
                log('Bind owns Socket')
                try{
                    this.socket.on('message', this._boundMsgEmitHandler) // TODO: msg Handling
                    this.socket.on('error', this._boundErrorEmitHandler)
                    this.socket.on('close', this._boundCloseEmitHandler)

                    this.socket.bind({
                        address: this.host,
                        port: this.port,
                    }, ()=>{ // TODO: Error Handling?
                        this.receiving = true
                        this.emit('listening')
                        return true
                    })
                }catch(e){
                    this.emit('error', e)
                    return e
                }

            }else{
                log('Bind doesn`t owns Socket')
                try{
                    let sockInfo = this.socket.address()

                    this.host = sockInfo.address
                    this.port = sockInfo.port

                    this.socket.on('message', this._boundMsgEmitHandler)
                    this.socket.on('error', this._boundErrorEmitHandler)
                    this.socket.on('close', this._boundCloseEmitHandler)
                    this.receiving = true
                }catch(e){
                    this.emit('error', e)
                    return e
                }
                this.emit('listening')
                return true
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