// Packet Strategies
// ------------------
// Receive              | UDP listen on 6454 | 
// Unicast Transmit     | UDP send on node IP
// Directed Broadcast   | UDP send on 2.0.0.255 (for 2.0.0.0/24)
// Limeted Broadcast    | UDP send on 255.255.255.255



// 
// Packet fields:
// 
// All Packets 
// ----------------
// ID (ARTNET)
// OpCode
// ----------------
// 
// All exept ArtPollReply
// ----------------
// ProtVerHi
// ProtVerLo
// --------------
// Packet Fields
// 

const { ArtNetConstants } = require("../constants");
const {AT_OPCODES, AT_REPORT_CODES, AT_STYLE_CODES, AT_OEM_CODES} = require('../codes');



class ArtNetMinPacket {
  constructor(opCode){
    this.id = ArtNetConstants.AT_ID; // "Art-Net\0"
    this.opCode = opCode
  }

  writeMinHeader(buffer, offset = 0){
    if(buffer && buffer.length >= 10){
      // ID (8 bytes)
      offset = buffer.write(this.id, offset)

      // opCode (2 bytes)
      offset = buffer.writeUInt16LE(this.opCode, offset)

      return offset
    }else{
      throw new Error("Buffer to small or not set, buffer.lenght >= 10 bytes.")
    }
  }

  readMinHeader(buffer, offset = 0){
    if(buffer && buffer.toString('utf8', offset, offset+8) == "Art-Net\0" && buffer.length >= 10){
      // ID (8 bytes)
      this.id = buffer.toString('utf8', offset, offset+8);
      offset = offset + 8;

      // opCode (2 bytes)
      this.opCode = buffer.readUInt16LE(offset);

      return offset
    }else if(buffer.toString('utf8', offset, offset+8) != "Art-Net\0"){
      throw new Error("Art-Net ID (Art-Net\x00) not found in Packet! ID Found: " + buffer.toString('utf8', offset, offset+8) + " ;")
    }else if(buffer || buffer.length < 10){
      throw new Error("Buffer to small or not set, buffer.lenght >= 10 bytes.")
    }
  }

  toBuffer() {
    throw new Error("toBuffer() must be implemented by subclass");
  }

  fromBuffer(buffer) {
    throw new Error("fromBuffer() must be implemented by subclass");
  }

  getSize() {
    throw new Error("getSize() must be implemented by subclass");
  }

}

class ArtNetPacket extends ArtNetMinPacket{
  constructor(opCode){
    super(opCode);
    this.protVerHi = ArtNetConstants.AT_PROT_VER_HI;
    this.protVerLo = ArtNetConstants.AT_PROT_VER_LO;

  }

  writeHeader(buffer, offset = 0){
    if(buffer && buffer.length == 12){
      // minimized Art-Net header generated, returns the offset
      var minHeadOffset = this.writeMinHeader(buffer)
      offset = minHeadOffset + offset

      // Protocol version Hi and Low Bytes
      offset = buffer.writeUInt8(this.protVerHi, offset)
      offset = buffer.writeUInt8(this.protVerLo, offset)

      return offset
    }else{
      throw new Error("Buffer to small or not set, buffer.lenght >= 12 bytes.")
    }
  }

  readHeader(buffer, offset = 0){
    if(buffer && buffer.toString('utf8', offset, offset+8) == "Art-Net\0" && buffer.length >= 12){
      // ID (8 bytes)
      this.id = buffer.toString('utf8', offset, offset+8);
      offset = offset + 8;
      
      // opCode (2 bytes)
      this.opCode = buffer.readUInt16LE(offset);
      offset = offset + 2
      
      // Protocol Version Hi and Low Bytes
      this.protVerHi = buffer.readUInt8(offset)
      offset = offset + 1
      this.protVerLo = buffer.readUInt8(offset)
      
      return offset
    }else if (buffer.toString('utf8', offset, offset+8) != "Art-Net\0"){
      throw new Error("Art-Net ID (Art-Net\x00) not found in Packet! ID Found: " + buffer.toString('utf8', offset, offset+8) + " ;")
    }else if (!buffer || buffer.length < 12){
      throw new Error("Buffer to small or not set, buffer.lenght >= 12 bytes.")
    }
  }
}


module.exports = {
  ArtNetMinPacket,
  ArtNetPacket,
}