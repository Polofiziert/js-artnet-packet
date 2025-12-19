// import * as r from 'restructure';
const r = require('restructure');
const {MappedBitfield, FixedString, MappedEnum} = require('./fieldTypeExtention')

const pollSchema = new r.Struct({
    id: FixedString(8),
    opCode: r.uint16le,
    protoVer: new r.Array(r.uint8, 2),
    // Packet Begins
    flags: MappedBitfield({
        targetedMode: { bits: [5, 1], map: { on: 1, off: 0 } }, 
        vlcTransmission: { bits: [4, 1], map: { on: 1, off: 0 } }, 
        broadcastDignostics: { bits: [3, 1], map: { yes: 1, no: 0 } }, 
        sendDiagnostics: { bits: [2, 1], map: { yes: 1, no: 0 } }, 
        sendOnChange: { bits: [1, 1], map: { yes: 1, no: 0 } }, 
    }),
    diagPriority: MappedEnum({
        dpLow: 0x10,
        dpMed: 0x40,
        dpHigh: 0x80,
        dpCritical: 0xe0,
        dpVolatile: 0xf0,
    }),
    // Min packet lenght for valid artPollReply Packet, following fields are Art-Net4 Specific
    targetPortAddress: new r.Array(r.uint8, 4),
    estaMan: new r.Array(r.uint8, 2),
    oem: new r.Array(r.uint8, 2),
})

module.exports = {
    pollSchema
}



