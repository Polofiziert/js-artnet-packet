//const r = require('restructure');
const {toBinString, toBinStringPretty, toHexStringPretty} = require('./helper');
const {Buffer} = require('node:buffer')
const dgram = require('node:dgram')

const client = dgram.createSocket('udp4');
const os = require('node:os')

const { jap } = require("./src/jap");
const justArtnet = new jap

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
        console.log(`--- Now Listening! --- \n ipAddress: ${ipAddress}; \n ipBroadcast: ${ipBroadcastAddress} `);
        const buf = [157, 45, 89, 223, 8, 142, 200, 66, 101, 247, 120, 34, 58, 94, 172, 213, 78, 193, 110, 55, 134, 68, 219, 141, 59, 188, 3, 130, 204, 29, 114, 244, 71, 9, 153, 182, 47, 11, 216, 252, 33, 190, 128, 186, 97, 76, 40, 126, 64, 193, 150, 159, 21, 231, 75, 169, 103, 202, 62, 39, 136, 18, 85, 237, 5, 250, 162, 93, 139, 209, 106, 54, 179, 30, 208, 26, 105, 201, 7, 63, 158, 235, 70, 204, 134, 55, 180, 220, 161, 179, 41, 132, 74, 199, 245, 13, 123, 44, 107, 192, 91, 219, 83, 11, 167, 227, 32, 82, 164, 87, 116, 241, 142, 204, 49, 186, 23, 98, 210, 51, 111, 245, 46, 157, 103, 205, 2, 143, 6, 153, 234, 102, 79, 240, 19, 133, 54, 168, 115, 226, 238, 71, 250, 124, 207, 203, 93, 44, 108, 13, 253, 14, 27, 99, 35, 221, 28, 104, 95, 122, 254, 135, 229, 111, 38, 174, 5, 148, 200, 170, 93, 212, 132, 48, 231, 82, 92, 179, 148, 123, 30, 109, 246, 76, 180, 216, 56, 167, 98, 172, 88, 247, 36, 194, 63, 222, 96, 119, 237, 208, 137, 10, 99, 175, 249, 233, 114, 28, 183, 53, 101, 241, 128, 69, 206, 97, 195, 209, 238, 31, 159, 65, 70, 19, 160, 194, 110, 118, 215, 40, 76, 13, 87, 242, 154, 251, 53, 220, 234, 43, 217, 197, 121, 8, 145, 83, 109, 57, 98, 142, 233, 62, 177, 238, 69, 190, 226, 53, 95, 189, 58, 130, 167, 224, 61, 27, 151, 218, 116, 45, 129, 155, 232, 80, 164, 136, 32, 13, 71, 120, 26, 204, 202, 137, 49, 33, 161, 107, 181, 140, 234, 70, 51, 193, 4, 72, 206, 12, 239, 77, 168, 214, 57, 158, 124, 243, 90, 203, 17, 115, 84, 195, 103, 221, 46, 143, 201, 58, 159, 110, 1, 187, 227, 104, 63, 90, 183, 240, 84, 160, 185, 61, 189, 247, 147, 78, 151, 205, 170, 36, 142, 229, 92, 184, 54, 131, 161, 48, 146, 11, 60, 246, 173, 99, 119, 185, 231, 50, 22, 117, 232, 253, 126, 200, 235, 19, 7, 138, 148, 229, 255, 14, 75, 233, 56, 157, 86, 179, 19, 209, 137, 30, 199, 249, 66, 225, 38, 35, 91, 81, 47, 117, 2, 145, 135, 130, 179, 205, 230, 155, 1, 126, 44, 22, 79];
    
        
        setInterval(() => {
            console.log('Test is Sending');
            // client.send(message, 41234, 'localhost', (err) => { do ... })
            // artnetProtocol.send('artDmx', address, { portAddress: {net: 0, subNet: 0, universe: 0}, data: buf } )
            artnetProtocol.send('artDmx', "192.168.2.114", { portAddress: {net: 0, subNet: 0, universe: 0}, data: buf } )
        }, 1000);
    })

    artnetProtocol.bind()

