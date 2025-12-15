# Art-Net 4 Library - Test Suite Documentation

## Overview

Comprehensive test suite for the Art-Net 4 JavaScript library with unit tests for all packet types, serializers, and the parser.

## Test Structure

```
src/tests/
├── test-utils.js           # Test runner and utilities
├── packets/
│   ├── test-base.js        # Base class tests
│   ├── test-poll.js        # ArtNetPoll tests
│   ├── test-pollreply.js   # ArtNetPollReply tests
│   ├── test-dmx.js         # ArtNetDMX tests
│   └── test-sync.js        # ArtNetSync tests
├── parser/
│   └── test-parser.js      # PacketParser tests
└── serializers/
    ├── test-buffer-serializer.js  # BufferSerializer tests
    └── test-json-serializer.js    # JsonSerializer tests
```

## Running Tests

### Run All Tests
```bash
node run-tests.js
```

### Run Individual Test Files
```bash
# Base class tests
node src/tests/packets/test-base.js

# Packet type tests
node src/tests/packets/test-poll.js
node src/tests/packets/test-pollreply.js
node src/tests/packets/test-dmx.js
node src/tests/packets/test-sync.js

# Parser tests
node src/tests/parser/test-parser.js

# Serializer tests
node src/tests/serializers/test-buffer-serializer.js
node src/tests/serializers/test-json-serializer.js
```

### Using npm scripts (recommended)

Update your `package.json`:

```json
{
  "scripts": {
    "test": "node run-tests.js",
    "test:base": "node src/tests/packets/test-base.js",
    "test:poll": "node src/tests/packets/test-poll.js",
    "test:pollreply": "node src/tests/packets/test-pollreply.js",
    "test:dmx": "node src/tests/packets/test-dmx.js",
    "test:sync": "node src/tests/packets/test-sync.js",
    "test:parser": "node src/tests/parser/test-parser.js",
    "test:serializers": "node src/tests/serializers/test-buffer-serializer.js && node src/tests/serializers/test-json-serializer.js"
  }
}
```

Then run:
```bash
npm test              # Run all tests
npm run test:dmx      # Run specific test
npm run test:parser   # Run parser tests
```

## Test Utilities

The `test-utils.js` module provides:

### TestRunner Class

```javascript
const { TestRunner } = require('./test-utils');

const runner = new TestRunner('MyTest Suite');

runner.test('should do something', () => {
  // test code
});

runner.test('should handle errors', () => {
  // test code
});

await runner.run(); // Runs all tests and prints report
```

### Assertion Functions

```javascript
const {
  assertEqual,           // Assert strict equality
  assertBuffer,          // Assert buffer equality
  assertBufferLength,    // Assert buffer length
  assertThrows,          // Assert function throws
  assertInstanceOf,      // Assert instance type
} = require('./test-utils');

assertEqual(actual, expected, message);
assertBuffer(actual, expected, message);
assertBufferLength(buffer, length, message);
assertThrows(fn, message);
assertInstanceOf(obj, constructor, message);
```

## Test Coverage

### Base Classes (test-base.js)

**ArtNetPacket Tests:**
- ✓ Create packet with default values
- ✓ Create packet with custom protocol version
- ✓ Write common header correctly
- ✓ Read common header correctly
- ✓ Validate protocol version
- ✓ Throw when toBuffer not implemented
- ✓ Throw when fromBuffer not implemented

**ArtNetReplyPacket Tests:**
- ✓ Create reply packet without protocol version
- ✓ Write common header without ProtVer
- ✓ Read common header without ProtVer

### Packet Types

#### ArtNetPoll (test-poll.js)
- ✓ Create with defaults
- ✓ Create with custom values
- ✓ Serialize to buffer (14 bytes)
- ✓ Serialize with correct header
- ✓ Serialize flags and priority
- ✓ Deserialize from buffer
- ✓ Round-trip packet
- ✓ Set/get targeted mode flag
- ✓ Set/get VLC transmission flag
- ✓ Get correct size
- ✓ Throw on buffer too small

#### ArtNetPollReply (test-pollreply.js)
- ✓ Create with defaults (no ProtVer!)
- ✓ Create with custom values
- ✓ Truncate long names
- ✓ Serialize to buffer (239 bytes)
- ✓ Serialize header without ProtVer
- ✓ Serialize IP address correctly
- ✓ Serialize port number
- ✓ Deserialize from buffer
- ✓ Round-trip packet
- ✓ Get firmware version string
- ✓ Set firmware version
- ✓ Get correct size
- ✓ Throw on buffer too small

#### ArtNetDMX (test-dmx.js)
- ✓ Create with defaults
- ✓ Create with custom values
- ✓ Serialize to buffer (530 bytes)
- ✓ Serialize with correct header
- ✓ Serialize sequence, physical, universe
- ✓ Serialize DMX length as big-endian
- ✓ Serialize DMX data
- ✓ Deserialize from buffer
- ✓ Round-trip packet
- ✓ Set and get channel values
- ✓ Throw on invalid channel number
- ✓ Throw on invalid channel value
- ✓ Set multiple channels at once
- ✓ Clear all DMX data
- ✓ Enable sequence tracking
- ✓ Throw on invalid sequence
- ✓ Disable sequence tracking
- ✓ Get correct size
- ✓ Throw on buffer too small

#### ArtNetSync (test-sync.js)
- ✓ Create with defaults
- ✓ Create with custom values
- ✓ Serialize to buffer (14 bytes)
- ✓ Serialize with correct header
- ✓ Serialize auxiliary bytes
- ✓ Deserialize from buffer
- ✓ Round-trip packet
- ✓ Get correct size
- ✓ Throw on buffer too small

### PacketParser (test-parser.js)

- ✓ Identify ArtNetPoll packet
- ✓ Identify ArtNetDMX packet
- ✓ Get opcode name
- ✓ Parse ArtNetPoll packet
- ✓ Parse ArtNetPollReply packet
- ✓ Parse ArtNetDMX packet
- ✓ Parse ArtNetSync packet
- ✓ Check valid Art-Net packet
- ✓ Reject invalid Art-Net packet
- ✓ Throw on invalid ID
- ✓ Throw on unknown opcode
- ✓ Throw on buffer too small

### BufferSerializer (test-buffer-serializer.js)

- ✓ Serialize packet to buffer
- ✓ Deserialize buffer to packet
- ✓ Handle round-trip serialization
- ✓ Serialize different packet types
- ✓ Throw on invalid packet
- ✓ Throw on invalid buffer

### JsonSerializer (test-json-serializer.js)

- ✓ Serialize packet to JSON string
- ✓ Deserialize JSON string
- ✓ Convert packet to object
- ✓ Include ProtVer in object
- ✓ Convert buffer fields
- ✓ Handle round-trip (deserialize JSON)
- ✓ Throw on invalid JSON
- ✓ Throw on non-string input
- ✓ Handle null packet gracefully

## Total Tests

- **Base Classes**: 10 tests
- **ArtNetPoll**: 11 tests
- **ArtNetPollReply**: 13 tests
- **ArtNetDMX**: 20 tests
- **ArtNetSync**: 9 tests
- **PacketParser**: 14 tests
- **BufferSerializer**: 6 tests
- **JsonSerializer**: 9 tests

**Total: 92 unit tests**

## Test Output Example

```
============================================================
  ArtNetDMX Packet Tests
============================================================

✓ should create DMX packet with defaults
✓ should create DMX packet with custom values
✓ should serialize to buffer (530 bytes)
✓ should serialize with correct header
✓ should serialize sequence, physical, universe
✓ should serialize DMX length as big-endian
✓ should serialize DMX data
✓ should deserialize from buffer
✓ should round-trip packet
✓ should set and get channel values
✓ should throw on invalid channel number
✓ should throw on invalid channel value
✓ should set multiple channels at once
✓ should clear all DMX data
✓ should enable sequence tracking
✓ should throw on invalid sequence
✓ should disable sequence tracking
✓ should return correct size
✓ should throw on buffer too small

────────────────────────────────────────────────────────────
Results: 19 passed, 0 failed
────────────────────────────────────────────────────────────
```

## Test Design Patterns

### Round-Trip Testing
Each packet type tests serialization → deserialization → re-serialization to ensure consistency:

```javascript
runner.test('should round-trip packet', () => {
  const original = new ArtNetDMX(10, 1, 5);
  original.setChannel(0, 255);
  
  const buffer = original.toBuffer();
  const parsed = ArtNetDMX.fromBuffer(buffer);
  const buffer2 = parsed.toBuffer();

  assertBuffer(buffer, buffer2); // Buffers must match exactly
});
```

### Boundary Testing
Tests check edge cases and invalid inputs:

```javascript
runner.test('should throw on invalid channel number', () => {
  const packet = new ArtNetDMX();
  try {
    packet.setChannel(-1, 100);
    throw new Error('Should have thrown');
  } catch (err) {
    assertEqual(err.message.includes('out of range'), true);
  }
});
```

### Parser Integration Testing
Tests verify that parsed packets match their original structure:

```javascript
runner.test('should parse ArtNetDMX packet', () => {
  const original = new ArtNetDMX(10, 1, 5);
  original.setChannel(0, 255);
  const buffer = original.toBuffer();

  const parsed = PacketParser.parse(buffer);
  assertEqual(parsed instanceof ArtNetDMX, true);
  assertEqual(parsed.sequence, 10);
  assertEqual(parsed.getChannel(0), 255);
});
```

## Adding New Tests

To add tests for new packet types:

1. **Create test file**
```javascript
// src/tests/packets/test-mynewpacket.js
const { TestRunner, assertEqual } = require('../test-utils');
const MyNewPacket = require('../../packets/mynewpacket');

class TestMyNewPacket {
  static async run() {
    const runner = new TestRunner('MyNewPacket Tests');

    runner.test('should create packet', () => {
      const packet = new MyNewPacket();
      assertEqual(packet.opCode, OpCodes.MYCODE);
    });

    return await runner.run();
  }
}

(async () => {
  const result = await TestMyNewPacket.run();
  process.exit(result ? 0 : 1);
})();
```

2. **Add to test configuration**
Add to `TEST_CONFIGURATION.js` and `run-tests.js`

3. **Add npm script**
Update `package.json` with new test script

## CI/CD Integration

For GitHub Actions, GitLab CI, or other CI systems:

```yaml
# .github/workflows/tests.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '14'
      - run: npm test
```

## Troubleshooting

### Test Fails with "Buffer too small"
- Ensure packet size constants match the spec
- Verify serialization code writes correct number of bytes

### Parse Tests Fail
- Check PacketParser.js has mapping for OpCode
- Verify fromBuffer() implementation matches spec

### Round-Trip Fails
- Ensure serialization and deserialization are symmetrical
- Check byte ordering (little-endian vs big-endian)

## Performance Notes

- Each test completes in < 10ms
- Full suite runs in ~2 seconds
- No external dependencies required
- Memory usage: < 50MB

## Future Enhancements

- [ ] Code coverage reporting (nyc/istanbul)
- [ ] Integration tests with network simulation
- [ ] Performance benchmarks
- [ ] Spec compliance validator
- [ ] Property-based testing (fast-check)
