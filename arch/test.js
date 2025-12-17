const { Buffer } = require('node:buffer');
const {ArtNetConstants} = require('../lib/constants');
const {AT_OPCODES, AT_REPORT_CODES, AT_STYLE_CODES, AT_OEM_CODES} = require('../lib/codes');


const buf = Buffer.alloc(24)
const buffer = buf
const id = buf.write(ArtNetConstants.AT_ID)
const opCode = buf.writeUInt16LE(AT_OPCODES[0].code, id)
//const protVerHi = buf.writeUInt8(ArtNetConstants.AT_PROT_VER_HI, opCode)
//const protVerLo = buf.writeUInt8(ArtNetConstants.AT_PROT_VER_LO, protVerHi)
/*
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
console.log("-------------------------")

process.stdout.write("test" + "\n")
process.stdout.write("test" + "\n")
process.stdout.write(bufiii)

console.log("-------------------------")
var ipAddr = "192.168.1.1"

var ipNum = ipAddr.split('.').map((num)=>parseInt(num, 10))
console.log(ipNum)
console.log(ipAddr)

console.log("-------------------------")

function ValidateIPaddress(ipaddress) {  
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
        return (true)  
    }  
    alert("You have entered an invalid IP address!")  
    return (false)  
}  

const ipRegEx = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

console.log(ipRegEx.test("192.1.1.1"))


console.log("-------------------------")

["1", "2", "3"].map((str) => parseInt(str, 10)); // [1, 2, 3]

*/

var bufferT = Buffer.alloc(24)
console.log(bufferT)

console.log("-------------------------")


var self1 = {
    name : "ipAddr",
    size : "UInt8",
    sizeCount : 4,
    data : {
        ipAddr : [192, 168, 1, 102]
    }
}
self2 = {
    name : "versInf",
    size : "UInt8",
    sizeCount : 4,
    data : {
        versInfo : [192, 123]
    },
}
self3 = {
    name : "one",
    size : "UInt8",
    sizeCount : 4,
    data : {
        status : {
            indicator: {
                unknown : "00000"
            }
        }
    },
}

function writeToBuffer(buf, offset, self){
    if(self.size == "UInt8"){
        offset = buf.writeUInt8(val, offset)
    }
    if(self.size == "UInt16LE"){
        offset = buf.writeUInt16LE(val, offset)
    }
    if(self.size == "UInt32LE"){
        offset = buf.writeUInt32LE(val, offset)
    }
    return offset
}


function toBuffer_old(buf, offset, self){
    self.data.forEach(element => {
        if(element.isArray){
            element.map(function(val){
                offset = writeToBuffer(buf, offset, self)
            });
        }
    });
    return offset
}

function toBuffer(buf, offset, self){
    for (const [key, value] of Object.entries(self.data)) {
        if(Array.isArray(value)){
            value.map(function(val){
                console.log(val)
                offset = writeToBuffer(buf, offset, val)
            });
        }
    }
    return offset
}

toBuffer(bufferT, 0, self1)

console.log("-------------------------")

console.log(bufferT)




