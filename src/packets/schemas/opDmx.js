// import * as r from 'restructure';
const r = require('restructure');
const {MappedBitfield, FixedString} = require('./fieldTypeExtention')

const dmxSchema = new r.Struct({
    // Art-Net Header
    id: FixedString(8), 
    opCode: r.uint16le,
    protoVer: new r.Array(r.uint8, 2),
    // Packet Begins
    sequence: r.uint8,
    physical: r.uint8,
    subUni: r.uint8,
    net: r.uint8,
    length: r.uint16be,
    data: new r.Array(r.uint8, 512),
})

module.exports = {
    dmxSchema
}



