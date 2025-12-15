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


/**
 * Art-Net 4 Packet Classes
 * 
 */

const ARTNET_ID = "Art-Net\0"; // 8 bytes: "Art-Net" + null terminator

/**
 * Base Art-Net 4 Packet Class
 * All Art-Net packets inherit from this class
 * @param {number} opCode - The operation code for this packet
 * @param {number} protVerHi - Protocol version high byte (default: 0)
 * @param {number} protVerLo - Protocol version low byte (default: 14 for Art-Net 4)
 */
class ArtNetPacket {
  constructor(opCode, protVerHi = 0, protVerLo = 14) {
    this.id = ARTNET_ID;
    this.opCode = opCode;
    this.protVerHi = protVerHi;
    this.protVerLo = protVerLo;
  }
}

module.exports = {
  ArtNetPacket,
  ArtDmx,
  ArtNetPoll,
  ArtNetPollReply,
  ArtNetTimeCode,
};

