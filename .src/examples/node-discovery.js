/**
 * Node Discovery Example
 * 
 * This example demonstrates:
 * - Sending ArtNetPoll packets
 * - Receiving and parsing ArtNetPollReply
 * - Discovering nodes on the network
 */

const ArtNet = require('..');

// Create a transceiver
const transceiver = new ArtNet.Transceiver();

// Listen for packets
transceiver.listen(() => {
  console.log("Art-Net discovery started, waiting for node replies...\n");

  // Create a poll packet
  const pollPacket = new ArtNet.ArtNetPoll();
  pollPacket.setTargetedMode(false); // Poll all nodes

  console.log("Sending ArtNetPoll...");
  transceiver.send(pollPacket, "255.255.255.255");
});

// Handle incoming packets
transceiver.on('ArtNetPollReply', (packet, info) => {
  console.log("\n=== Node Discovered ===");
  console.log(`IP Address: ${packet.ipAddress}`);
  console.log(`Source: ${info.address}:${info.port}`);
  console.log(`Short Name: ${packet.nodeShortName}`);
  console.log(`Long Name: ${packet.nodeLongName}`);
  console.log(`Firmware: ${packet.getFirmwareVersion()}`);
  console.log(`Num Ports: ${packet.numPorts}`);
});

// Handle parse errors
transceiver.on('parseError', (data) => {
  console.error("Parse error:", data.error.message);
});

// Handle invalid packets
transceiver.on('invalidPacket', (data) => {
  console.log("Received non-Art-Net packet from", data.info.address);
});

// Timeout after 5 seconds
setTimeout(() => {
  console.log("\n\nDiscovery timeout. Closing...");
  transceiver.close();
}, 5000);

// Error handling
transceiver.on('error', (err) => {
  console.error("Transceiver error:", err);
  transceiver.close();
});
