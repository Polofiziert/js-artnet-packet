# Art-Net 4 JavaScript Library - Architecture Document

## Overview

This document describes the architecture, design patterns, and organization of the Art-Net 4 JavaScript library.

## Design Principles

1. **Separation of Concerns** - Each module has a single responsibility
2. **Strategy Pattern** - Different serialization strategies (Buffer, JSON)
3. **Factory Pattern** - PacketParser creates appropriate packet instances
4. **Open/Closed Principle** - Easy to extend with new packet types without modifying existing code
5. **DRY (Don't Repeat Yourself)** - Common functionality in base classes

## Directory Structure

```
src/
├── constants/
│   ├── opcodes.js         # OpCode definitions and reverse mapping
│   ├── protocol.js        # Protocol constants (port, timeout, etc.)
│   └── index.js           # Unified export
│
├── packets/               # All packet type classes
│   ├── base/
│   │   ├── ArtNetPacket.js        # Base class WITH ProtVer fields
│   │   ├── ArtNetReplyPacket.js   # Base class WITHOUT ProtVer fields
│   │   └── index.js               # Base exports
│   │
│   ├── discovery/         # Node discovery packets
│   │   ├── ArtNetPoll.js
│   │   ├── ArtNetPollReply.js
│   │   └── index.js
│   │
│   ├── dmx/               # DMX transport packets
│   │   ├── ArtNetDMX.js
│   │   ├── ArtNetSync.js
│   │   └── index.js
│   │
│   ├── rdm/               # RDM control packets (todo)
│   ├── config/            # Configuration packets (todo)
│   ├── diagnostics/       # Diagnostic packets (todo)
│   │
│   └── index.js           # Unified packet exports
│
├── parser/                # Packet identification and parsing
│   ├── PacketParser.js    # Main parser class
│   └── index.js           # Parser exports
│
├── serializers/           # Data format conversion
│   ├── Serializer.js      # Base serializer interface
│   ├── BufferSerializer.js # Packet ↔ Buffer conversion
│   ├── JsonSerializer.js  # Packet ↔ JSON conversion (debug)
│   └── index.js           # Serializer exports
│
├── network/               # Network communication
│   ├── Transceiver.js     # UDP send/receive handler
│   └── index.js           # Network exports
│
├── utils/                 # Utility functions (todo)
│   ├── validators.js      # Field validation
│   └── helpers.js         # Helper functions
│
├── index.js               # Main library export (Facade pattern)
└── README.md              # Library documentation
```

## Core Architecture Patterns

### 1. Base Class Strategy (Protocol Inconsistency Handling)

**Problem**: Art-Net 4 spec has an inconsistency - most packets include ProtVerHi/ProtVerLo fields, but ArtPollReply does not.

**Solution**: Two separate base classes

```
ArtNetPacket (WITH ProtVer)
├── ArtNetPoll
├── ArtNetDMX
├── ArtNetSync
└── ... (most packets)

ArtNetReplyPacket (NO ProtVer)
└── ArtNetPollReply (exception!)
```

**Benefits**:
- Type safety - prevents accidental use of ProtVer on reply packets
- Self-documenting - class hierarchy shows protocol structure
- Prevents bugs - writeCommonHeader() has different behavior per class

### 2. Packet Lifecycle

```
User Code
    ↓
Create Packet Instance
(new ArtNetDMX())
    ↓
Set Properties
(dmx.setChannel(0, 255))
    ↓
Serialize to Buffer
(packet.toBuffer())
    ↓
Network Transport
(transceiver.send(packet))
    ↓
[Network]
    ↓
Parse Buffer
(PacketParser.parse(buffer))
    ↓
Typed Packet Instance
(instanceof ArtNetDMX)
    ↓
Handle Event
(transceiver.on('ArtNetDMX', ...))
    ↓
User Code
```

### 3. Parser Strategy (Factory Pattern)

PacketParser acts as a factory that:
1. Identifies the packet type (OpCode)
2. Routes to appropriate packet class
3. Calls fromBuffer() on that class
4. Returns typed packet instance

```javascript
// Before: raw buffer
const buffer = ...;

// Parser identifies OpCode and creates appropriate instance
const packet = PacketParser.parse(buffer);

// After: typed packet instance
if (packet instanceof ArtNetDMX) { ... }
```

### 4. Serializer Strategy

Multiple serialization strategies without affecting packet classes:

```
Serializer (interface)
├── BufferSerializer   # For network transport
└── JsonSerializer     # For debugging/logging
```

New formats can be added without modifying packet classes.

### 5. Network Event Architecture

Transceiver emits multiple levels of events:

```
UDP Packet Received
    ↓
Validate (is it Art-Net?)
    ↓
Parse (which packet type?)
    ├─→ Success: emit typed event
    │   - 'packet' (generic)
    │   - 'ArtNetDMX' (specific)
    │
    └─→ Error: emit error event
        - 'parseError'
        - 'invalidPacket'
```

## Class Hierarchy

### Packets

```
ArtNetPacket (abstract)
├── writeCommonHeader()
├── readCommonHeader()
├── toBuffer() [abstract]
└── [subclasses implement toBuffer/fromBuffer]

ArtNetReplyPacket (abstract)
├── writeCommonHeader() [no ProtVer]
├── readCommonHeader() [no ProtVer]
├── toBuffer() [abstract]
└── [subclasses implement toBuffer/fromBuffer]
```

### Serializers

```
Serializer (abstract interface)
├── serialize() [abstract]
└── deserialize() [abstract]

BufferSerializer extends Serializer
├── serialize(packet) → Buffer
└── deserialize(buffer) → Packet

JsonSerializer extends Serializer
├── serialize(packet) → string
└── deserialize(string) → Object
```

### Network

```
Transceiver extends EventEmitter
├── listen()
├── send(packet, address)
├── close()
└── Events: 'packet', 'ArtNetXxx', 'error', 'parseError'
```

## Data Flow Examples

### Sending DMX

```
User Code:
  dmx = new ArtNetDMX()
  dmx.setChannel(0, 255)
  transceiver.send(dmx, "192.168.1.255")
           ↓
Transceiver:
  buffer = packet.toBuffer()
  socket.send(buffer, port, address)
           ↓
Network: [UDP packet sent]
```

### Receiving DMX

```
Network: [UDP packet received]
           ↓
Transceiver socket:
  'message' event
           ↓
PacketParser.parse(buffer):
  opCode = buffer.readUInt16LE(8)
  PacketClass = packetMap[opCode]
  packet = PacketClass.fromBuffer(buffer)
           ↓
Transceiver Events:
  emit('packet', packet, info)
  emit('ArtNetDMX', packet, info)
           ↓
User Code:
  transceiver.on('ArtNetDMX', (packet, info) => {
    channel1 = packet.getChannel(0)
  })
```

## Packet Structure Diagram

### ArtNetDMX (530 bytes)

```
Offset  Len  Field           Value/Description
0       8    ID              "Art-Net\0"
8       2    OpCode          0x5000 (little-endian)
10      1    ProtVerHi       0
11      1    ProtVerLo       14 (Art-Net 4)
12      1    Sequence        0-255 (0 = disabled)
13      1    Physical        0-3
14      2    Universe        0-32767 (little-endian)
16      2    DMX Length      512 (big-endian)
18      512  DMX Data        Channel values
---     ---
530     530  Total Size
```

### ArtNetPollReply (239 bytes) - NOTE: No ProtVer!

```
Offset  Len  Field           
0       8    ID              "Art-Net\0"
8       2    OpCode          0x2101 (little-endian)
10      4    IP Address      [0]=MSB, [3]=LSB
14      2    Port            0x1936 (little-endian)
16      1    VersInfoHi      Firmware high
17      1    VersInfoLo      Firmware low
18      1    NetSwitch       
19      1    SubSwitch       
20      2    OEM             (big-endian)
...
239     239  Total Size
(No ProtVerHi/ProtVerLo at offset 10-11!)
```

## Adding New Packet Types

To add a new packet type (e.g., ArtNetAddress):

1. **Create the packet class**
```javascript
// src/packets/config/ArtNetAddress.js
const { ArtNetPacket } = require('../base');
const { OpCodes } = require('../../constants');

class ArtNetAddress extends ArtNetPacket {
  constructor() {
    super(OpCodes.ADDRESS);
    // ... properties
  }

  toBuffer() { /* ... */ }
  static fromBuffer(buffer) { /* ... */ }
  getSize() { return 120; }
}
```

2. **Update constants/opcodes.js**
```javascript
const OpCodes = {
  // ...
  ADDRESS: 0x6000,
};
```

3. **Create index for category**
```javascript
// src/packets/config/index.js
const ArtNetAddress = require('./ArtNetAddress');
module.exports = { ArtNetAddress };
```

4. **Update parser**
```javascript
// src/parser/PacketParser.js
const { ArtNetAddress } = require('../../packets/config');

const packetMap = {
  // ...
  [OpCodes.ADDRESS]: ArtNetAddress,
};
```

5. **Update main exports**
```javascript
// src/packets/index.js
const { ArtNetAddress } = require('./config');
module.exports = {
  // ...
  ArtNetAddress,
};
```

6. **Add example** (optional)
```javascript
// examples/address-config.js
const ArtNet = require('../src');
// ...
```

## Testing Strategy

- **Unit Tests**: Each packet class independently
- **Integration Tests**: Parser → Packet → Serialization round-trips
- **Network Tests**: Transceiver send/receive
- **Protocol Compliance**: Verify byte structure matches spec

## Future Enhancements

- [ ] Complete RDM packet types (ArtTodRequest, ArtTodData, ArtRdm, etc.)
- [ ] Configuration packets (ArtAddress, ArtIpProg, etc.)
- [ ] Diagnostic packets (ArtDiagData, etc.)
- [ ] Media server packets (ArtVlc, etc.)
- [ ] TypeScript rewrite
- [ ] Comprehensive test suite
- [ ] Performance benchmarks
- [ ] CI/CD pipeline
- [ ] Browser support (WebRTC for DMX)

## Standards Compliance

- **Art-Net 4 Protocol Release V1.4** (Document Revision 1.4dp 23/10/2025)
- **RFC 1700** (UDP/IP)
- **DMX512-A** (ANSI/ESTA E1.11-2008)

## References

- Art-Net Protocol: http://www.Art-Net.info
- Official Specification: Download from Artistic Licence
- RDM Standard: ANSI/ESTA E1.20-2010
