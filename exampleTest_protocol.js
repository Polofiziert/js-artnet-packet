//const r = require('restructure');
const {toBinString, toBinStringPretty, toHexStringPretty} = require('./helper');
const {Buffer} = require('node:buffer')
const dgram = require('node:dgram')
const util = require('util')

const client = dgram.createSocket('udp4');
const os = require('node:os')

const { jap } = require("./src/jap");
const { ArtNetCodes } = require('./src/codes');
const { DmxPacket } = require("./src/packets/dmxPacket")
const { count } = require('node:console');
const justArtnet = new jap

let dmxPacket = new DmxPacket()
dmxPacket.data.net = 0
dmxPacket.data.subUni = 2

var conter = 0

// -----------------------------------
    console.log("-------- Starting Artnet Server --------")

    const hostAddress = os.networkInterfaces().en0[1].address
    const ipAddress = "192.168.2.114"
    const ipBroadcastAddress = "192.168.2.255"
    
    console.log(`--- Host: ${hostAddress}; ipAddress: ${ipAddress}; ipBroadcast: ${ipBroadcastAddress} ---`);
    
    const options = {
        host: hostAddress, // ignored if socket is given, used to create a socket
        port: 6454, // ignored if socket is given, used to create a socket
    }

    const artnetProtocol = justArtnet.createArtNetProtocol(options)

    artnetProtocol.on('message', (msg, rinfo)=>{
        console.log(`--- Message: ${msg}; rInfo: ${rinfo}; ---`);
    })

    artnetProtocol.on('error', (e)=>{
        console.log(`--- ERROR: ${e}; ---`);
    })
    
    artnetProtocol.on('listening', ()=>{
        console.log(`--- Now Listening! --- \n ipAddress: ${artnetProtocol.host}; \n port: ${artnetProtocol.port} `);
        console.log(`--- Now Socket! --- \n socket: ${util.inspect(artnetProtocol.socket)};`);
        
        
        setInterval(() => {
            console.log('Test is Sending');
            // client.send(message, 41234, 'localhost', (err) => { do ... })
            // artnetProtocol.send('artDmx', address, { portAddress: {net: 0, subNet: 0, universe: 0}, data: buf } )
            var buf = [conter];

            artnetProtocol.send('artDmx', ipAddress, { portAddress: {net: 0, subNet: 16, universe: 2}, data: buf } )
            
            // dmxPacket.data.data = buf
            // artnetProtocol.send('artDmx', ipAddress, dmxPacket )
            
            let pollOptions = {
                flags: {
                    targetedMode: "on", 
                    vlcTransmission: "on", 
                    broadcastDignostics: "yes", 
                    sendDiagnostics: "yes", 
                    sendOnChange: "no" 
                },
                diagPriority: "dpVolatile",
                // Min packet lenght for valid artPollReply Packet, following fields are Art-Net4 Specific
                targetPortAddress: [0,0,0,1],
                estaMan: [0,1],
                oem: [0,1],
            }
            artnetProtocol.send('artPoll', ipAddress, pollOptions )
            


            conter = conter+1
        }, 1000);
    })

    artnetProtocol.bind()

