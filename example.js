//const r = require('restructure');
const {toBinString, toBinStringPretty, toHexStringPretty} = require('./helper');
const {Buffer} = require('node:buffer')
const {MappedBitfield, FixedString, MappedEnum} = require('./src/packets/schemas/fieldTypeExtention')
const {pollReplySchema} = require('./src/packets/schemas/opPollReply')
const dgram = require('node:dgram')
const {ArtNetCodes} = require("./src/codes")
const { PollReplyPacket } = require("./src/packets/pollReplyPacket")
const { PollPacket } = require("./src/packets/pollPacket")


// -----------------------------------
    console.log("----------------")
    
    const client = dgram.createSocket('udp4');
    const packet = new PollPacket
    const packetReply = new PollReplyPacket
    const ipAddres = "127.0.0.102"
    const ipBroadcastAddres = "127.0.0.255"
    
    client.bind({
        address: 'localhost',
        port: 6454,
    }, () => {
        console.log('Bound successfully');
        console.log('Bount to: ' + client.address().address);
        console.log('Bount to: ' + client.address().family);
        console.log('Bount to: ' + client.address().port);
        console.log('Emitters: ' + client.eventNames());
        console.log('Remote: ' + client.remoteAddress());
        console.log('Remote: ' + client.);
    });

    let i = 0;
    let sendInteral = setInterval(() => {
        let buffer = packet.encode()
        client.send(buffer, 6454, ipAddres, (err) => {
            if (err) client.close();
            console.log('--- Message sent ---');
        });
        
        i++
        i > 10000 ? clearInterval(sendInteral) : null
        i > 10000 ? client.close() : null
    }, 1000);

    client.on('message', (msg, rinfo) => {
        console.log('Received info:', rinfo);
        console.log('Received reply:', msg);

        let opCode = msg.readInt16LE(8)
        opCode = ArtNetCodes.getOpCodeByCode(opCode)
        console.log(opCode)

        if(opCode == "OpPollReply" && rinfo.address != ipAddres){
            let buffer = packetReply.encode()
            client.send(buffer, 6454, ipAddres, (err) => {
                if (err) client.close();
                console.log('--- Reply sent ---');
            });
        }
        
        
    });

    console.log("----------------")

        

    //console.log(toHexStringPretty(buffer, 32))

    //console.log(ArtNetCodes.getReportCodeDefinitionByCode(1))


