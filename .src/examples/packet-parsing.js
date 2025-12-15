/**
 * Packet Parsing Example
 * 
 * This example demonstrates:
 * - Parsing raw buffers
 * - Using PacketParser
 * - Serializing packets to JSON for debugging
 */

const ArtNet = require('..');

// Create sample packets
const dmxPacket = new ArtNet.ArtNetDMX(1, 0, 0);
dmxPacket.setChannel(0, 255);
dmxPacket.setChannel(1, 128);

const pollPacket = new ArtNet.ArtNetPoll();

console.log("=== Packet Serialization ===\n");

// Convert to buffer
const dmxBuffer = dmxPacket.toBuffer();
const pollBuffer = pollPacket.toBuffer();

console.log(`DMX Packet Buffer Size: ${dmxBuffer.length} bytes`);
console.log(`Poll Packet Buffer Size: ${pollBuffer.length} bytes`);
console.log(`DMX Hex (first 20 bytes): ${dmxBuffer.slice(0, 20).toString('hex')}`);

console.log("\n=== Packet Parsing ===\n");

// Parse buffers back
const parsedDmx = ArtNet.PacketParser.parse(dmxBuffer);
const parsedPoll = ArtNet.PacketParser.parse(pollBuffer);

console.log(`Parsed DMX - Type: ${parsedDmx.constructor.name}`);
console.log(`Parsed DMX - Universe: ${parsedDmx.universe}`);
console.log(`Parsed DMX - Channel 0: ${parsedDmx.getChannel(0)}`);
console.log(`Parsed DMX - Channel 1: ${parsedDmx.getChannel(1)}`);

console.log(`\nParsed Poll - Type: ${parsedPoll.constructor.name}`);
console.log(`Parsed Poll - OpCode: 0x${parsedPoll.opCode.toString(16).padStart(4, '0')}`);

console.log("\n=== JSON Serialization (for debugging) ===\n");

// Serialize to JSON
const jsonSerializer = new ArtNet.JsonSerializer();
const dmxJson = jsonSerializer.serialize(dmxPacket);
const pollJson = jsonSerializer.serialize(pollPacket);

console.log("DMX Packet JSON:");
console.log(dmxJson);

console.log("\nPoll Packet JSON:");
console.log(pollJson);

console.log("\n=== OpCode Identification ===\n");

// Identify packets without full parsing
const dmxOpCode = ArtNet.PacketParser.identify(dmxBuffer);
const pollOpCode = ArtNet.PacketParser.identify(pollBuffer);

console.log(`DMX OpCode: 0x${dmxOpCode.toString(16).padStart(4, '0')} - ${ArtNet.PacketParser.getOpCodeName(dmxOpCode)}`);
console.log(`Poll OpCode: 0x${pollOpCode.toString(16).padStart(4, '0')} - ${ArtNet.PacketParser.getOpCodeName(pollOpCode)}`);
