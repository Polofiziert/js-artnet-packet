/**
 * ArtNetDMX Packet Tests
 */

const { TestRunner, assertEqual, assertBufferLength } = require('../test-utils');
const ArtNetDMX = require('../../packets/dmx/ArtNetDMX');
const { OpCodes, DMX_CHANNELS, SEQUENCE_DISABLE } = require('../../constants');

class TestArtNetDMX {
  static async run() {
    const runner = new TestRunner('ArtNetDMX Packet Tests');

    runner.test('should create DMX packet with defaults', () => {
      const packet = new ArtNetDMX();
      assertEqual(packet.opCode, OpCodes.OUTPUT);
      assertEqual(packet.sequence, SEQUENCE_DISABLE);
      assertEqual(packet.physical, 0);
      assertEqual(packet.universe, 0);
      assertEqual(packet.dmxLength, DMX_CHANNELS);
      assertBufferLength(packet.dmxData, DMX_CHANNELS);
    });

    runner.test('should create DMX packet with custom values', () => {
      const packet = new ArtNetDMX(5, 2, 3);
      assertEqual(packet.sequence, 5);
      assertEqual(packet.physical, 2);
      assertEqual(packet.universe, 3);
    });

    runner.test('should serialize to buffer (530 bytes)', () => {
      const packet = new ArtNetDMX();
      const buffer = packet.toBuffer();
      assertBufferLength(buffer, 530);
    });

    runner.test('should serialize with correct header', () => {
      const packet = new ArtNetDMX(1, 0, 0);
      const buffer = packet.toBuffer();

      // Check ID
      assertEqual(buffer.toString('ascii', 0, 7), 'Art-Net');

      // Check OpCode
      assertEqual(buffer.readUInt16LE(8), OpCodes.OUTPUT);

      // Check ProtVer
      assertEqual(buffer[10], 0);
      assertEqual(buffer[11], 14);
    });

    runner.test('should serialize sequence, physical, universe', () => {
      const packet = new ArtNetDMX(100, 2, 500);
      const buffer = packet.toBuffer();

      assertEqual(buffer[12], 100); // sequence
      assertEqual(buffer[13], 2);   // physical
      assertEqual(buffer.readUInt16LE(14), 500); // universe
    });

    runner.test('should serialize DMX length as big-endian', () => {
      const packet = new ArtNetDMX();
      const buffer = packet.toBuffer();

      const length = buffer.readUInt16BE(16);
      assertEqual(length, 512);
    });

    runner.test('should serialize DMX data', () => {
      const packet = new ArtNetDMX();
      packet.setChannel(0, 255);
      packet.setChannel(1, 128);
      packet.setChannel(10, 64);

      const buffer = packet.toBuffer();

      assertEqual(buffer[18], 255);
      assertEqual(buffer[19], 128);
      assertEqual(buffer[28], 64);
    });

    runner.test('should deserialize from buffer', () => {
      const original = new ArtNetDMX(50, 1, 100);
      original.setChannel(0, 200);
      const buffer = original.toBuffer();

      const parsed = ArtNetDMX.fromBuffer(buffer);
      assertEqual(parsed.opCode, OpCodes.OUTPUT);
      assertEqual(parsed.sequence, 50);
      assertEqual(parsed.physical, 1);
      assertEqual(parsed.universe, 100);
      assertEqual(parsed.getChannel(0), 200);
    });

    runner.test('should round-trip packet', () => {
      const original = new ArtNetDMX(25, 3, 5);
      for (let i = 0; i < 100; i++) {
        original.setChannel(i, i % 256);
      }
      const buffer = original.toBuffer();
      const parsed = ArtNetDMX.fromBuffer(buffer);
      const buffer2 = parsed.toBuffer();

      assertEqual(buffer.equals(buffer2), true);
    });

    runner.test('should set and get channel values', () => {
      const packet = new ArtNetDMX();
      packet.setChannel(0, 255);
      packet.setChannel(511, 128);

      assertEqual(packet.getChannel(0), 255);
      assertEqual(packet.getChannel(511), 128);
    });

    runner.test('should throw on invalid channel number', () => {
      const packet = new ArtNetDMX();
      try {
        packet.setChannel(-1, 100);
        throw new Error('Should have thrown');
      } catch (err) {
        assertEqual(err.message.includes('out of range'), true);
      }

      try {
        packet.setChannel(512, 100);
        throw new Error('Should have thrown');
      } catch (err) {
        assertEqual(err.message.includes('out of range'), true);
      }
    });

    runner.test('should throw on invalid channel value', () => {
      const packet = new ArtNetDMX();
      try {
        packet.setChannel(0, -1);
        throw new Error('Should have thrown');
      } catch (err) {
        assertEqual(err.message.includes('out of range'), true);
      }

      try {
        packet.setChannel(0, 256);
        throw new Error('Should have thrown');
      } catch (err) {
        assertEqual(err.message.includes('out of range'), true);
      }
    });

    runner.test('should set multiple channels at once', () => {
      const packet = new ArtNetDMX();
      packet.setChannels(0, [255, 128, 64, 32, 16]);

      assertEqual(packet.getChannel(0), 255);
      assertEqual(packet.getChannel(1), 128);
      assertEqual(packet.getChannel(2), 64);
      assertEqual(packet.getChannel(3), 32);
      assertEqual(packet.getChannel(4), 16);
    });

    runner.test('should clear all DMX data', () => {
      const packet = new ArtNetDMX();
      packet.setChannels(0, [255, 200, 100, 50]);
      packet.clear();

      for (let i = 0; i < 100; i++) {
        assertEqual(packet.getChannel(i), 0);
      }
    });

    runner.test('should enable sequence tracking', () => {
      const packet = new ArtNetDMX();
      packet.enableSequence(10);
      assertEqual(packet.sequence, 10);
    });

    runner.test('should throw on invalid sequence', () => {
      const packet = new ArtNetDMX();
      try {
        packet.enableSequence(0);
        throw new Error('Should have thrown');
      } catch (err) {
        assertEqual(err.message.includes('1-255'), true);
      }

      try {
        packet.enableSequence(256);
        throw new Error('Should have thrown');
      } catch (err) {
        assertEqual(err.message.includes('1-255'), true);
      }
    });

    runner.test('should disable sequence tracking', () => {
      const packet = new ArtNetDMX();
      packet.enableSequence(50);
      packet.disableSequence();
      assertEqual(packet.sequence, SEQUENCE_DISABLE);
    });

    runner.test('should return correct size', () => {
      const packet = new ArtNetDMX();
      assertEqual(packet.getSize(), 530);
    });

    runner.test('should throw on buffer too small', () => {
      const smallBuffer = Buffer.alloc(100);
      try {
        ArtNetDMX.fromBuffer(smallBuffer);
        throw new Error('Should have thrown');
      } catch (err) {
        assertEqual(err.message.includes('too small'), true);
      }
    });

    return await runner.run();
  }
}

(async () => {
  const result = await TestArtNetDMX.run();
  process.exit(result ? 0 : 1);
})();
