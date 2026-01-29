const {Buffer} = require('node:buffer')
const dgram = require('node:dgram')
const client = dgram.createSocket('udp4');
const os = require('node:os')

//const r = require('restructure');
const {toBinString, toBinStringPretty, toHexStringPretty} = require('./helper');
const {MappedBitfield, FixedString, MappedEnum} = require('./src/packets/schemas/fieldTypeExtention')
const {pollReplySchema} = require('./src/packets/schemas/opPollReply')
const {ArtNetCodes} = require("./src/codes")
const { PollReplyPacket } = require("./src/packets/pollReplyPacket")
const { PollPacket } = require("./src/packets/pollPacket")

const { jap } = require("./src/jap")

const util = require('util');
const log = util.debuglog('sandbox');

const socket = dgram.createSocket('udp4')
socket.on('listening', ()=>{
    log('Socket now listening ...')
});
socket.on('message', (msg)=>{
    log('Socket msg: ', msg)
});
socket.on('close', ()=>{
    log('Socket now closed')
});
socket.on('error', err => { 
    log('Socket Err: ',err); 
});
socket.bind({
    address: 'localhost',
    port: 6454,
}); 


// -----------------------------------

let justArtnet = new jap

log(justArtnet)

let artnetProtocol = justArtnet.createArtNetProtocol({socket})
// let artnetProtocol = justArtnet.createArtNetProtocol({
//     host: "127.0.0.1", 
//     port: 8000,
// })

artnetProtocol.on('listening', ()=>{
    log('artnetProtocol listening ...')
    log('socket Listeners close: ', util.inspect(socket.listeners('close')))
    log('socket Listeners message: ', util.inspect(socket.listeners('message')))
    log('socket Listeners error: ', util.inspect(socket.listeners('error')))
    
    log('artnetProtocol: ', artnetProtocol)


    artnetProtocol.close();
})
artnetProtocol.on('error', (err) => {   
    log(`artnetProtocol Error: ${err}`); 
    artnetProtocol.close();
});

artnetProtocol.on('close', ()=>{
    log('artnetProtocol now Closed')
    log('socket Listeners close: ', util.inspect(socket.listeners('close')))
    log('socket Listeners message: ', util.inspect(socket.listeners('message')))
    log('socket Listeners error: ', util.inspect(socket.listeners('error')))
    socket.close()
})

socket.on('listening', ()=>{
    log('artnetProtocol: ', artnetProtocol)    
    artnetProtocol.bind();
});


// artnetProtocol.send('artDmx', {})
// artnetProtocol.close()

/* 

artnetProtocol.on('artPollReply', (artPollReplyPacket) => { 
    log('artPollReply received')
    log(artPollReplyPacket)
});
artnetProtocol.on('artPoll', (artPollPacket) => { 
    log('artPoll received ' + artPollPacket)
});

artnetProtocol.on('send', (artpollPacket) => { 
    log('Have Sent a packet')
});
 */