const {AT_OPCODES, AT_REPORT_CODES, AT_STYLE_CODES, AT_OEM_CODES} = require('./lib/codes');
const {ArtNetConstants} = require("./lib/constants");
const {ArtNetMinPacket, ArtNetPacket} = require("./lib/packets");



var artMinPack1 = new ArtNetMinPacket(AT_OPCODES[0].code);
console.log(artMinPack1)

const buf = Buffer.alloc(10)
var offset = artMinPack1.writeMinHeader()
console.log(buf)
console.log(offset)
console.log("-------------")

var artMinPack2 = new ArtNetMinPacket(AT_OPCODES[0].code);
console.log(artMinPack2)

const bufOpDmxMin = Buffer.from([0x41, 0x72, 0x74, 0x2d, 0x4e, 0x65, 0x74, 0x00, 0x00, 0x50])
console.log(bufOpDmxMin)
artMinPack2.readMinHeader(bufOpDmxMin)
console.log(artMinPack2)
console.log(bufOpDmxMin)

console.log("-------------")

var artPack = new ArtNetPacket(AT_OPCODES[0].code);
const bufOpDmx = Buffer.from([0x41, 0x72, 0x74, 0x2d, 0x4e, 0x65, 0x74, 0x00, 0x00, 0x50, 0x00, 0x0e])
const bufArtPack = Buffer.alloc(12)
var offset3 = artPack.writeHeader(bufArtPack)

console.log(artPack)
console.log(bufArtPack)
console.log(bufOpDmx)
console.log(bufOpDmx.length)
console.log("___---___")

var offset1 = artPack.readHeader(bufOpDmx)
offset3 = artPack.writeHeader(bufArtPack)

console.log(artPack)
console.log(bufArtPack)
console.log(bufOpDmx)
console.log(offset1)




/*
var artPack2 = new ArtNetPacket(AT_OPCODES[3].code);
console.log(artPack2)
*/


