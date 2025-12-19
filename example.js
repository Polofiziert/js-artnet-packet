//const r = require('restructure');
const {toBinString, toBinStringPretty, toHexStringPretty} = require('./helper');
const {Buffer} = require('node:buffer')
const {MappedBitfield, FixedString, MappedEnum} = require('./src/schemas/fieldTypeExtention')
const {pollReplySchema} = require('./src/schemas/opPollReply')
const dgram = require('node:dgram')



// -----------------------------------

let bootArr = ["normal", "other"]
let authArr = ["unknown", "front_panel", "network"]
let indicatorArr = ["unknown", "locate", "mute", "normal"]
let rdmArr = ["yes", "no"]
let ubeaArr = ["yes", "no"]

    let PollReplyData = {
        id: "Art-Net\0",
        opCode: 8448,
        ipAddress: [192, 168, 2, 113],
        port: 6454,
        versionInfo: [123, 34],
        netSwitch: 123,
        subSwitch: 123,
        oem: [12, 33],
        ubeaVersion: 123,
        status1: {
            indicator: "normal",
            auth: "network",
            bootMode: "normal",
            isRdm: "no",
            hasUbea: "no",
        },
        estaMan: [123, 122],
        portName: "DMX-Workshop",
        longName: "DMX-Workshop",
        nodeReport: "#0001 [0002] zzzzz...This node Feels very gooood!!!",
        numPorts: 0x0001,
        portTypes1: {
            canOutput: "yes",
            canInput: "no",
            protocol: "artnet",
        },
        portTypes2: {
            canOutput: "yes",
            canInput: "no",
            protocol: "artnet",
        },
        portTypes3: {
            canOutput: "yes",
            canInput: "no",
            protocol: "artnet",
        },
        portTypes4: {
            canOutput: "yes",
            canInput: "no",
            protocol: "artnet",
        },
        goodInput1: {
            dataReceived: "no", 
            dmxTestPackets: "no",
            dmxSip: "no",
            dmxTextPacket: "no",
            isDisabled: "yes",
            errorReceived: "no",
            convertTo: "artnet", 
        },
        goodInput2: {
            dataReceived: "no", 
            dmxTestPackets: "no",
            dmxSip: "no",
            dmxTextPacket: "no",
            isDisabled: "yes",
            errorReceived: "no",
            convertTo: "artnet", 
        },
        goodInput3: {
            dataReceived: "no", 
            dmxTestPackets: "no",
            dmxSip: "no",
            dmxTextPacket: "no",
            isDisabled: "yes",
            errorReceived: "no",
            convertTo: "artnet", 
        },
        goodInput4: {
            dataReceived: "no", 
            dmxTestPackets: "no",
            dmxSip: "no",
            dmxTextPacket: "no",
            isDisabled: "yes",
            errorReceived: "no",
            convertTo: "artnet", 
        },
        goodOutputA1: {
            dataTransmitted: "no", 
            dmxTestPackets: "no",
            dmxSip: "no", 
            dmxTextPacket: "no",
            isMerging: "yes", 
            portFault: "no", 
            mergeMode: "htp", 
            convertFrom: "artnet", 
        },
        goodOutputA2: {
            dataTransmitted: "no", 
            dmxTestPackets: "no",
            dmxSip: "no", 
            dmxTextPacket: "no",
            isMerging: "yes", 
            portFault: "no", 
            mergeMode: "htp", 
            convertFrom: "artnet", 
        },
        goodOutputA3: {
            dataTransmitted: "no", 
            dmxTestPackets: "no",
            dmxSip: "no", 
            dmxTextPacket: "no",
            isMerging: "yes", 
            portFault: "no", 
            mergeMode: "htp", 
            convertFrom: "artnet", 
        },
        goodOutputA4: {
            dataTransmitted: "no", 
            dmxTestPackets: "no",
            dmxSip: "no", 
            dmxTextPacket: "no",
            isMerging: "yes", 
            portFault: "no", 
            mergeMode: "htp", 
            convertFrom: "artnet", 
        },
        swIn1: 0,
        swIn2: 0,
        swIn3: 0,
        swIn4: 0,
        swOut1: 0,
        swOut2: 0,
        swOut3: 0,
        swOut4: 0,
        acnPriority: 0,
        swMacro: ({
            macro1: "off", 
            macro2: "off", 
            macro3: "off", 
            macro4: "off", 
            macro5: "off", 
            macro6: "off", 
            macro7: "off", 
            macro8: "off", 
        }),
        swRemote: ({
            remote1: "off", 
            remote2: "off", 
            remote3: "off", 
            remote4: "off", 
            remote5: "off", 
            remote6: "off", 
            remote7: "off", 
            remote8: "off", 
        }),        
        style: "stController",
        macAddress: [0xe6, 0x00, 0x8e, 0xe6, 0xd3, 0x74],
        bindIp: [192, 168, 2, 113],
        bindIndex: 1,
        status2: {
            rdmArtAddr: "no",
            outputStyleArtAddr: "yes", 
            squawking: "yes", 
            artAndAcn: "yes", 
            portAddrs: "bit15", 
            canDhcp: "yes", 
            configureIp: "dhcp", 
            webFig: "no", 
        },
        goodOutputB1: {
            rdm: "on",
            outputStyle: "continuos",
            discovery: "on",
            backgroundDiscovery: "on",
        },
        goodOutputB2: {
            rdm: "on",
            outputStyle: "continuos",
            discovery: "on",
            backgroundDiscovery: "on",
        },
        goodOutputB3: {
            rdm: "on",
            outputStyle: "continuos",
            discovery: "on",
            backgroundDiscovery: "on",
        },
        goodOutputB4: {
            rdm: "on",
            outputStyle: "continuos",
            discovery: "on",
            backgroundDiscovery: "on",
        },
        status3: {
            failsafeState: "hold", 
            failsafeProgramable: "yes", 
            supportLlrp: "no", 
            portDirectionSwitch: "no",
            canRdmNet: "no",
            canBackgroundQueue: "no",
            canDisableBckQueue: "no",
        },
        defaultRespUid: [234, 234, 234, 234, 22, 22],
        userData: [23, 233],
        refreshRate: 0x002c,
        bckQueuePolicy: MappedEnum({
            statusNone: 0x00,
            statusAdvisory: 0x01,
            statusWarning: 0x02,
            statusError: 0x03,
            disabled: 0x04,
            manufacturer1: 0x05,
            manufacturer2: 0x06,
            manufacturer3: 0x07,
            manufacturer4: 0x08,
            manufacturer5: 0x09,
            manufacturer6: 0x0a,
            manufacturer7: 0x0b,
        }),
    }

    // 3. GENERATE (Encode)
    console.log('Not Parsed:', PollReplyData); 
    const buffer = pollReplySchema.toBuffer(PollReplyData);

    //console.log('Hex:', buffer.toString('hex')); 
    console.log(toBinStringPretty(buffer, 64)); 
    console.log("----------------")
    console.log(toHexStringPretty(buffer, 32)); 
    console.log(buffer); 
    // console.log(buffer); 
    // Output: 0104e0 (Status byte 0xE0 matches 1110 0000)
    console.log("Size: " + pollReplySchema.size())

    // 4. PARSE (Decode)
    //const parsed = pollReplySchema.fromBuffer(buffer);
    //console.log('Parsed:', parsed);
    // Output: { bootMode: 'normal', auth: 'network', indicator: 'normal' }

    console.log("----------------")

    const client = dgram.createSocket('udp4');
    const message = Buffer.from('Hello UDP');
    let i = 0;
    let sendInteral = setInterval(() => {
        client.send(buffer, 6454, 'localhost', (err) => {
        if (err) client.close();
            console.log('Message sent');
        });
        i++
        i > 10 ? clearInterval(sendInteral) : null
        i > 10 ? client.close() : null
    }, 1000);

    console.log("iam still allive")
        


/*

let lksdjal = MappedBitfield({
        indicator: { 
            bits: [6, 2], 
            map: { unknown: 0, locate: 1, mute: 2, normal: 3 } 
        },
        auth: { 
            bits: [4, 2], 
            map: { unknown: 0, front_panel: 1, network: 2 } 
        },
        bootMode: {
            bits: [2, 1], 
            map: { normal: 0, other: 1 } 
        },
        isRdm: {
            bits: [1, 1], 
            map: { no: 0, yes: 1 } 
        },
        hasUbea: {
            bits: [0, 1], 
            map: { no: 0, yes: 1 } 
        },
    })

    let kdsjfak = {
            indicator: "locate",
            auth: "front_panel",
            bootMode: "other",
            isRdm: "yes",
            hasUbea: "yes",
    }

    const buf = Buffer.alloc(1)

    console.log(lksdjal)
    console.log(lksdjal.size())
    lksdjal.encode(buf, kdsjfak)
    console.log(toBinString(buf))

    console.log("-------------------------")
    
    
    let zui = MappedEnum({
        "control": 8,
        "node": 7,
        "unk": 234,
    })
    
    const zuiBuf = Buffer.alloc(1)
    
    console.log(zui)
    console.log(zui.size())
    zui.encode(zuiBuf, "unk")
    console.log(toBinString(zuiBuf))
    let string = zui.decode(zuiBuf)
    console.log(JSON.stringify(string))
    console.log(string.length)
    
    */


