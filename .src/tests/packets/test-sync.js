/**
 * ArtNetSync Packet Tests
 */

const { TestRunner, assertEqual, assertBufferLength } = require('../test-utils');
const ArtNetSync = require('../../packets/dmx/ArtNetSync');
const { OpCodes } = require('../../constants');

class TestArtNetSync {
  static async run() {
    const runner = new TestRunner('ArtNetSync Packet Tests');

    runner.test('should create sync packet with defaults', () => {
      const packet = new ArtNetSync();
      assertEqual(packet.opCode, OpCodes.SYNC);
      assertEqual(packet.aux1, 0);
      assertEqual(packet.aux2, 0);
    });

    runner.test('should create sync packet with custom values', () => {
      const packet = new ArtNetSync(0xAA, 0x55);
      assertEqual(packet.aux1, 0xAA);
      assertEqual(packet.aux2, 0x55);
    });

    runner.test('should serialize to buffer (14 bytes)', () => {
      const packet = new ArtNetSync();
      const buffer = packet.toBuffer();
      assertBufferLength(buffer, 14);
    });

    runner.test('should serialize with correct header', () => {
      const packet = new ArtNetSync();
      const buffer = packet.toBuffer();

      // Check ID
      assertEqual(buffer.toString('ascii', 0, 7), 'Art-Net');

      // Check OpCode
      assertEqual(buffer.readUInt16LE(8), OpCodes.SYNC);

      // Check ProtVer
      assertEqual(buffer[10], 0);
      assertEqual(buffer[11], 14);
    });

    runner.test('should serialize auxiliary bytes', () => {
      const packet = new ArtNetSync(0x12, 0x34);
      const buffer = packet.toBuffer();

      assertEqual(buffer[12], 0x12);
      assertEqual(buffer[13], 0x34);
    });

    runner.test('should deserialize from buffer', () => {
      const original = new ArtNetSync(0xFF, 0x00);
      const buffer = original.toBuffer();

      const parsed = ArtNetSync.fromBuffer(buffer);
      assertEqual(parsed.opCode, OpCodes.SYNC);
      assertEqual(parsed.aux1, 0xFF);
      assertEqual(parsed.aux2, 0x00);
    });

    runner.test('should round-trip packet', () => {
      const original = new ArtNetSync(123, 45);
      const buffer = original.toBuffer();
      const parsed = ArtNetSync.fromBuffer(buffer);
      const buffer2 = parsed.toBuffer();

      assertEqual(buffer.equals(buffer2), true);
    });

    runner.test('should return correct size', () => {
      const packet = new ArtNetSync();
      assertEqual(packet.getSize(), 14);
    });

    runner.test('should throw on buffer too small', () => {
      const smallBuffer = Buffer.alloc(10);
      try {
        ArtNetSync.fromBuffer(smallBuffer);
        throw new Error('Should have thrown');
      } catch (err) {
        assertEqual(err.message.includes('too small'), true);
      }
    });

    return await runner.run();
  }
}

(async () => {
  const result = await TestArtNetSync.run();
  process.exit(result ? 0 : 1);
})();
