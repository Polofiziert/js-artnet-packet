/**
 * Basic DMX Send Example
 * 
 * This example demonstrates:
 * - Creating an ArtNetDMX packet
 * - Setting channel values
 * - Sending the packet via Transceiver
 */

const ArtNet = require('..');

// Create a transceiver
const transceiver = new ArtNet.Transceiver();

// Create a DMX packet
const dmxPacket = new ArtNet.ArtNetDMX();

// Set some channel values (0-indexed)
dmxPacket.setChannel(0, 255);    // Channel 1 to full
dmxPacket.setChannel(1, 128);    // Channel 2 to half
dmxPacket.setChannel(10, 200);   // Channel 11 to 200

console.log("Sending DMX packet...");
console.log(`Universe: ${dmxPacket.universe}`);
console.log(`Channels set: 1=${dmxPacket.getChannel(0)}, 2=${dmxPacket.getChannel(1)}, 11=${dmxPacket.getChannel(10)}`);

// Listen first
transceiver.listen(() => {
  console.log("Transceiver listening on port 6454");

  // Send the packet
  transceiver.send(dmxPacket, "255.255.255.255", (err) => {
    if (err) {
      console.error("Error sending packet:", err);
    } else {
      console.log("Packet sent successfully!");
    }

    // Clean up
    transceiver.close();
  });

  // Send every second for 5 seconds
  let count = 0;
  const interval = setInterval(() => {
    if (count >= 5) {
      clearInterval(interval);
      transceiver.close();
      return;
    }

    dmxPacket.setChannel(0, (dmxPacket.getChannel(0) + 50) % 256); // Fade effect
    transceiver.send(dmxPacket);
    count++;
  }, 1000);
});

// Error handling
transceiver.on('error', (err) => {
  console.error("Transceiver error:", err);
});
