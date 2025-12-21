//const r = require('restructure');
const {toBinString, toBinStringPretty, toHexStringPretty} = require('./helper');
const {Buffer} = require('node:buffer')
const {MappedBitfield, FixedString, MappedEnum} = require('./src/packets/schemas/fieldTypeExtention')
const {pollReplySchema} = require('./src/packets/schemas/opPollReply')
const dgram = require('node:dgram')
const {ArtNetCodes} = require("./src/codes")
const { PollReplyPacket } = require("./src/packets/pollReplyPacket")
const { PollPacket } = require("./src/packets/pollPacket")

const client = dgram.createSocket('udp4');
const os = require('node:os')

// -----------------------------------
    console.log("-------- Starting Artnet Server --------")
    
    const packet = new PollPacket
    const packetReply = new PollReplyPacket
    const hostAddress = os.networkInterfaces().en0[1].address
    const ipAddres = "192.168.2.114"
    const ipBroadcastAddres = "192.168.2.255"
    
    
    client.bind({
        address: hostAddress,
        port: 6454,
        exclusive: true,
    }); 
    
    console.log('--- Sending ---');
    let i = 0;
    let sendInteral = setInterval(() => {
        let buffer = packet.encode()
        client.send(buffer, 6454, "2.255.255.255", (err) => {
            if (err) client.close();
            //console.log(`--- Message sent 2. --- \n Error: ${err}\n ------------------`)
        });
        client.send(buffer, 6454, "10.255.255.255", (err) => {
            if (err) client.close();
            //console.log(`--- Message sent 10. --- \n Error: ${err}\n ------------------`)

        });         
        i++
        i > 100 ? clearInterval(sendInteral) : null
        i > 100 ? client.close() : null
    }, 2500);
    
    
    console.log('--- Listening ---');
    client.on('message', (msg, rinfo) => {
        //console.log('Received info:', rinfo);
        //console.log('Received reply:', msg);
        //console.log(toHexStringPretty(msg, 32));

        let opCode = msg.readInt16LE(8)
        opCode = ArtNetCodes.getOpCodeByCode(opCode)
        //console.log(opCode)

        if(opCode == "OpPollReply" && rinfo.address != ipAddres){
            var inPollReplyPacket = new PollReplyPacket
            inPollReplyPacket = inPollReplyPacket.decode(msg)
            console.log(`--- Poll Reply received --- \n from: ${inPollReplyPacket.ipAddress}; name: ${inPollReplyPacket.portName} \n------------------`)
        }

        if(opCode == "OpPoll"){
            let buffer = packetReply.encode()
            client.send(buffer, 6454, rinfo.address, (err) => {
                if (err) client.close();
                console.log('--- Own Poll Reply sent to: '+ rinfo.address);
            });
            
            var inPollPacket = new PollPacket
            inPollPacket = inPollPacket.decode(msg)
            console.log(`--- Poll received --- \n from: ${rinfo.address}; oem: ${inPollPacket.oem} \n------------------`)

        }

        if(opCode != "OpPollReply" && opCode != "OpPoll"){
            console.log(`--- Unknown received --- \n from: ${rinfo.address}; opCode: ${opCode}}\n; ${toHexStringPretty(msg, 32)} \n------------------`)
        }
        
        
    });

