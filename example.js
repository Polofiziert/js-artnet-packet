const r = require('restructure');
const {toBinString} = require('./helper');
const {Buffer} = require('node:buffer')


/**
 * Factory for a bitfield that maps bits to human-readable strings.
 * @param {Object} bitMap - Definitions: { key: { bits: [start, count], map: { "label": value } } }
 */
const MappedBitfield = (bitMap) => ({
  size() { return 1; },
  
  encode(stream, obj) {
    let byte = 0;
    for (const [key, config] of Object.entries(bitMap)) {
      const [start, count] = config.bits;
      const rawValue = config.map ? config.map[obj[key]] : obj[key];
      // Mask value to fit bit count, shift to position, and OR into byte
      byte |= ((rawValue || 0) & ((1 << count) - 1)) << start;
    }
    stream.writeUInt8(byte);
  },

  decode(stream) {
    const byte = stream.readUInt8();
    const result = {};
    for (const [key, config] of Object.entries(bitMap)) {
      const [start, count] = config.bits;
      const rawValue = (byte >> start) & ((1 << count) - 1);
      
      if (config.map) {
        // Reverse lookup for string label
        const label = Object.keys(config.map).find(k => config.map[k] === rawValue);
        result[key] = label || rawValue;
      } else {
        result[key] = rawValue;
      }
    }
    return result;
  }
});

const FixedString = (length) => ({
    size() { return length; },
  
    encode(stream, obj) {
        stream.writeString(obj.substring(0,length).padEnd(length, "\0"), "utf8")
    },

    decode(stream) {
        let string = stream.readString(length, "utf8");
        string = string.replace(/\0/g, '')
        return string;
    }
});


const pollReplySchema = new r.Struct({
    ipAddress: new r.Array(r.uint8, 4),
    port: r.uint16le,
    versionInfo: new r.Array(r.uint8, 2),
    netSwitch: r.uint8,
    subSwitch: r.uint8,
    oem: new r.Array(r.uint8, 2),
    ubeaVersion: r.uint8,
    status1: MappedBitfield({
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
    }),
    estaMan: new r.Array(r.uint8, 2),
    portName: FixedString(18),
    longName: FixedString(64),
    nodeReport: FixedString(64),
    numPorts: r.uint16le,
    PortTypes1: MappedBitfield({
        canOutput: {
            bits: [7, 1], 
            map: { no: 0, yes: 1 } 
        },
        canInput: {
            bits: [6, 1], 
            map: { no: 0, yes: 1 } 
        },
        protocol: {
            bits: [0, 5], 
            map: { dmx512: 0, midi: 1, avab: 2, colortranCMX: 3, adb625: 4, artnet: 5, dali: 6} 
        },
    })

});

const testSchema = new r.Struct({
    ipAddress: new r.Array(r.uint8, 4),
    portName: FixedString(18),
    numPorts: r.uint8,
});


// -----------------------------------

let bootArr = ["normal", "other"]
let authArr = ["unknown", "front_panel", "network"]
let indicatorArr = ["unknown", "locate", "mute", "normal"]
let rdmArr = ["yes", "no"]
let ubeaArr = ["yes", "no"]

for (var i =0; i < 44; i++) {
    let PollReplyData = {
        ipAddress: [i,i+20,i+121,i+99],
        port: 6454,
        versionInfo: [123, 34],
        netSwitch: 123,
        subSwitch: 123,
        oem: [12, 33],
        ubeaVersion: 123,
        status1: {
            indicator: indicatorArr[i%4],
            auth: authArr[i%3],
            bootMode: bootArr[(i+1)%2],
            isRdm: rdmArr[(i+2)%2],
            hasUbea: ubeaArr[(i+3)%2],
        },
        estaMan: [123, 122],
        portName: "DMX-Workshop",
        longName: "DMX-Workshop",
        nodeReport: "This node Feels very gooood!!!",
        numPorts: 2345,
        PortTypes1: {
            canOutput: "yes",
            canInput: "no",
            protocol: "artnet",
        },
    }

    let testData = {
        ipAddress: [i,i+20,i+121,i+99],
        portName: "DMX-Workshop",
        numPorts: 23,
    }

    // 3. GENERATE (Encode)
    console.log('Parsed:', PollReplyData); 
    const buffer = pollReplySchema.toBuffer(PollReplyData);

    //console.log('Hex:', buffer.toString('hex')); 
    console.log(toBinString(buffer)); 
    // console.log(buffer); 
    // Output: 0104e0 (Status byte 0xE0 matches 1110 0000)
    console.log("Size: " + pollReplySchema.size())

    // 4. PARSE (Decode)
    const parsed = pollReplySchema.fromBuffer(buffer);
    console.log('Parsed:', parsed);
    // Output: { bootMode: 'normal', auth: 'network', indicator: 'normal' }

    console.log("----------------")
}




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


let zui = FixedString(10)

const zuiBuf = Buffer.alloc(13)

console.log(zui)
console.log(zui.size())
zui.encode(zuiBuf, "1234567890")
console.log(toBinString(zuiBuf))
let string = zui.decode(zuiBuf)
console.log(JSON.stringify(string))
console.log(string.length)

*/


