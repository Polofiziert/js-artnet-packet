const { Buffer } = require('node:buffer');
const {ArtNetConstants} = require('../lib/constants');
const {AT_OPCODES, AT_REPORT_CODES, AT_STYLE_CODES, AT_OEM_CODES} = require('../lib/codes');


const buf = Buffer.alloc(24)
const buffer = buf
const id = buf.write(ArtNetConstants.AT_ID)
const opCode = buf.writeUInt16LE(AT_OPCODES[0].code, id)
//const protVerHi = buf.writeUInt8(ArtNetConstants.AT_PROT_VER_HI, opCode)
//const protVerLo = buf.writeUInt8(ArtNetConstants.AT_PROT_VER_LO, protVerHi)

var offset = 3

if(buffer.toString('utf8', offset, offset+8) == "Art-Net\0"){
    // ID (8 bytes)
    var id2 = buffer.toString('utf8', offset, offset+8);

    // opCode (2 bytes)
    var opCode2 = buffer.readUInt16LE(8);
}else{
    //throw new Error("Art-Net ID (Art-Net) not found in Packet, ID Found: " + buffer.toString('utf8', offset, offset+8) + " ;")
}

console.log(id2 + " id")
console.log(opCode2 + " opCode")

console.log(buf)
console.log("-------------------------")
// lest see if you can get a buffer from a string
const bufi = Buffer.alloc(24)
var stringShort = "Art-Net"
console.log(stringShort)
offset = bufi.write(stringShort, 9);
offset = bufi.write(stringShort);
console.log(bufi)
console.log(offset)

console.log("-------------------------")

var longString = "Longer than 18 charackters"
console.log(longString)
console.log(longString.length)
console.log(longString.substring(0,18))
console.log(longString.substring(0,18).length)

const bufii = Buffer.alloc(20)
console.log(bufii)
bufii.write(longString.substring(0, 18))
console.log(bufii)
bufii.write(longString)
console.log(bufii)

console.log("-------------------------")

const bufiii = Buffer.alloc(64)

let text = "5 way to long is";
text = text.substring(0, 18).padEnd(18,"0");
console.log(text)
console.log(text.length)

text = text.substring(0, 18).padEnd(64,"\0");
console.log(text)
console.log(text.length)

bufiii.write(text)
console.log(bufiii)

console.log("-------------------------")

process.stdout.write("test" + "\n")
process.stdout.write("test" + "\n")
process.stdout.write(bufiii)
