# Art-Net 4 JavaScript Library

A comprehensive, well-architected JavaScript library for working with Art-Net 4 (DMX over Ethernet) packets.

## Features

✅ **Full Art-Net 4 Protocol Support**
- All major packet types (ArtDmx, ArtPoll, ArtPollReply, ArtSync, etc.)
- Proper handling of protocol inconsistencies (e.g., ArtPollReply without ProtVer)
- Protocol version 14 (Art-Net 4) compliant

✅ **Clean Architecture**
- Separate base classes for packets with/without ProtVer fields
- Strategy and Factory patterns for extensibility
- Parser for automatic packet identification
- Multiple serialization formats (Buffer, JSON)

✅ **Easy to Use**
- Intuitive API for creating and parsing packets
- Event-based network communication
- Comprehensive error handling
- JSDoc comments throughout

✅ **Well-Organized**
- Modular structure with clear separation of concerns
- Each packet type in its own file
- Easy to add new packet types

## Installation

```bash
npm install js-artnet-packet
```

## Quick Start

### Send DMX Data

```javascript
const ArtNet = require('js-artnet-packet');

// Create transceiver
const transceiver = new ArtNet.Transceiver();

// Create DMX packet
const dmx = new ArtNet.ArtNetDMX();
dmx.setChannel(0, 255);  // Channel 1 to full
dmx.setChannel(1, 128);  // Channel 2 to half

// Listen and send
transceiver.listen(() => {
  transceiver.send(dmx, "255.255.255.255");
  transceiver.close();
});
```

### Discover Nodes

```javascript
const transceiver = new ArtNet.Transceiver();

transceiver.listen(() => {
  // Send poll packet
  const poll = new ArtNet.ArtNetPoll();
  transceiver.send(poll, "255.255.255.255");
});

// Listen for replies
transceiver.on('ArtNetPollReply', (packet, info) => {
  console.log(`Found node: ${packet.nodeShortName} at ${packet.ipAddress}`);
});

setTimeout(() => transceiver.close(), 3000);
```

### Parse Packets

```javascript
const buffer = receivedUdpPacket; // from network

// Automatic parsing
const packet = ArtNet.PacketParser.parse(buffer);

if (packet instanceof ArtNet.ArtNetDMX) {
  console.log(`DMX Universe: ${packet.universe}`);
  console.log(`Channel 1: ${packet.getChannel(0)}`);
}
```

## Architecture

### Directory Structure

```
src/
├── constants/           # Protocol constants and OpCodes
├── packets/
│   ├── base/           # Base classes (ArtNetPacket, ArtNetReplyPacket)
│   ├── discovery/      # ArtNetPoll, ArtNetPollReply
│   ├── dmx/            # ArtNetDMX, ArtNetSync
│   ├── rdm/            # RDM packets (todo)
│   ├── config/         # Configuration packets (todo)
│   └── diagnostics/    # Diagnostic packets (todo)
├── parser/             # PacketParser for identifying/parsing packets
├── serializers/        # Serialization strategies (Buffer, JSON)
├── network/            # Transceiver for UDP communication
└── index.js            # Main export
```

### Key Classes

#### Base Classes

- **ArtNetPacket**: Base for packets WITH ProtVerHi/ProtVerLo fields
- **ArtNetReplyPacket**: Base for packets WITHOUT ProtVer fields (e.g., ArtPollReply)

#### Packet Types

- **ArtNetPoll**: Node discovery request
- **ArtNetPollReply**: Node discovery response (no ProtVer!)
- **ArtNetDMX**: DMX512 data transmission
- **ArtNetSync**: Synchronization signal

#### Utilities

- **PacketParser**: Parse buffers, identify packet types
- **Transceiver**: UDP send/receive with event handling
- **BufferSerializer**: Convert packets ↔ Buffer
- **JsonSerializer**: Convert packets ↔ JSON (debugging)

## API Reference

### Creating Packets

```javascript
// DMX Packet
const dmx = new ArtNet.ArtNetDMX(sequence, physical, universe, dmxData);
dmx.setChannel(0, 255);
dmx.setChannels(0, [255, 128, 64]);
dmx.clear();

// Poll Packet
const poll = new ArtNet.ArtNetPoll(flags, priority);
poll.setTargetedMode(true);
poll.setVlcTransmission(false);

// Poll Reply
const reply = new ArtNet.ArtNetPollReply(ipAddress, shortName, longName);
reply.setFirmwareVersion(1, 0);

// Sync Packet
const sync = new ArtNet.ArtNetSync(aux1, aux2);
```

### Network Communication

```javascript
const transceiver = new ArtNet.Transceiver(port, bindAddress, broadcast);

// Listen for packets
transceiver.listen(() => {
  console.log("Ready");
});

// Send packet
transceiver.send(packet, remoteAddress, callback);

// Event handling
transceiver.on('packet', (packet, info) => { });
transceiver.on('ArtNetDMX', (packet, info) => { });
transceiver.on('parseError', (data) => { });
transceiver.on('error', (err) => { });

// Close
transceiver.close(() => {
  console.log("Closed");
});
```

### Parsing Packets

```javascript
// Parse from buffer
const packet = ArtNet.PacketParser.parse(buffer);

// Identify OpCode without full parsing
const opCode = ArtNet.PacketParser.identify(buffer);

// Get OpCode name
const name = ArtNet.PacketParser.getOpCodeName(opCode);

// Check if valid Art-Net
const isArtNet = ArtNet.PacketParser.isArtNetPacket(buffer);
```

### Serialization

```javascript
// Buffer serialization
const bufferSerializer = new ArtNet.BufferSerializer();
const buffer = bufferSerializer.serialize(packet);
const packet2 = bufferSerializer.deserialize(buffer);

// JSON serialization (for debugging)
const jsonSerializer = new ArtNet.JsonSerializer();
const jsonString = jsonSerializer.serialize(packet);
console.log(jsonString);
```

## Protocol Notes

### ProtVerHi and ProtVerLo Fields

Most Art-Net 4 packets include ProtVerHi (field 3) and ProtVerLo (field 4) after OpCode:

- **Has ProtVer**: ArtNetPoll, ArtNetDMX, ArtNetSync, ArtNetAddress, etc.
- **No ProtVer**: ArtNetPollReply (goes directly to IP Address field)

This library handles this automatically through separate base classes.

### Packet Sizes

- ArtNetPoll: 14 bytes
- ArtNetPollReply: 239 bytes
- ArtNetDMX: 530 bytes
- ArtNetSync: 14 bytes

## Examples

See `/examples` folder for complete working examples:

- `basic-dmx-send.js` - Send DMX data
- `node-discovery.js` - Discover nodes on network
- `packet-parsing.js` - Parse and serialize packets

Run examples with:
```bash
node examples/basic-dmx-send.js
```

## Testing

```bash
npm test
```

## Standards

Complies with **Art-Net 4 Protocol Release V1.4** (Document Revision 1.4dp 23/10/2025)

Official spec: http://www.Art-Net.info

## License

MIT

## Contributing

Contributions welcome! Please ensure:
- Code follows existing patterns
- New packet types go in appropriate subdirectories
- All methods have JSDoc comments
- Examples are provided for new features
