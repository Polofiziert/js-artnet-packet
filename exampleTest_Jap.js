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

// const socket = dgram.createSocket('udp4')
// socket.on('listening', ()=>{
//     log('Socket Now Bound and listening ...')
// });
// socket.on('message', (msg)=>{
//     log(msg)
// });
// socket.on('close', ()=>{
//     log('... Socket closed')
// });
// socket.on('error', err => { 
//     log(err); 
// });
// socket.bind({
//     address: 'localhost',
//     port: 6454,
// }); 


// -----------------------------------

let justArtnet = new jap

// let artnetProtocol = justArtnet.createArtNetProtocol({socket})
let artnetProtocol = justArtnet.createArtNetProtocol({
    host: "192.168.2.123", 
    port: 6454,
})

log(artnetProtocol)

artnetProtocol.on('listening', ()=>{
    log('Now Bound and listening ...')
})


artnetProtocol.on('close', ()=>{
    log('... now Closed')
})

artnetProtocol.on('artPollReply', (artPollReplyPacket) => { 
    log('artPollReply received')
    log(artPollReplyPacket)
});
artnetProtocol.on('artPoll', (artPollPacket) => { 
	log('artPoll received ' + artPollPacket)
});

artnetProtocol.on('error', err => { 
    log(err); 
});

artnetProtocol.on('send', (artpollPacket) => { 
    log('Have Sent a packet')
});

artnetProtocol.bind();

// artnetProtocol.send('artDmx', {})
// artnetProtocol.close()