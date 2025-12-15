// Packet Strategies
// ------------------
// Receive              | UDP listen on 6454 | 
// Unicast Transmit     | UDP send on node IP
// Directed Broadcast   | UDP send on 2.0.0.255 (for 2.0.0.1/24)
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
// PtotVerHi
// ProtVerLo
// --------------
// Packet Fields