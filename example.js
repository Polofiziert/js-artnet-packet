const {AT_OPCODES, AT_REPORT_CODES, AT_STYLE_CODES, AT_OEM_CODES} = require('./lib/codes');
const {ArtNetConstants} = require("./lib/constants");
const {ArtNetMinPacket, ArtNetPacket} = require("./lib/packets");

//let minPack = new ArtNetMinPacket;
var artPack = new ArtNetPacket(AT_OPCODES[3].code);

console.log(artPack)

console.log(artPack.toBuffer())


