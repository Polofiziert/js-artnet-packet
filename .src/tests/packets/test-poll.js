/**
 * ArtNetPoll Packet Tests
 */

const { TestRunner, assertEqual, assertBuffer, assertBufferLength } = require('../test-utils');
const ArtNetPoll = require('../../packets/discovery/ArtNetPoll');
const { OpCodes } = require('../../constants');

class TestArtNetPoll {
  static async run() {
    const runner = new TestRunner('ArtNetPoll Packet Tests');

    runner.test('should create poll packet with defaults', () => {
      const packet = new ArtNetPoll();
      assertEqual(packet.opCode, OpCodes.POLL);
      assertEqual(packet.protVerHi, 0);
      assertEqual(packet.protVerLo, 14);
      assertEqual(packet.flags, 0);
      assertEqual(packet.priority, 0);
    });

    runner.test('should create poll packet with custom values', () => {
      const packet = new ArtNetPoll(0x02, 0x01);
      assertEqual(packet.flags, 0x02);
      assertEqual(packet.priority, 0x01);
    });

    runner.test('should serialize to buffer (14 bytes)', () => {
      const packet = new ArtNetPoll();
      const buffer = packet.toBuffer();
      assertBufferLength(buffer, 14);
    });

    runner.test('should serialize with correct header', () => {
      const packet = new ArtNetPoll();
      const buffer = packet.toBuffer();

      // Check ID
      assertEqual(buffer.toString('ascii', 0, 7), 'Art-Net');

      // Check OpCode
      assertEqual(buffer.readUInt16LE(8), OpCodes.POLL);

      // Check ProtVer
      assertEqual(buffer[10], 0);
      assertEqual(buffer[11], 14);
    });

    runner.test('should serialize flags and priority', () => {
      const packet = new ArtNetPoll(0xAA, 0x55);
      const buffer = packet.toBuffer();

      assertEqual(buffer[12], 0xAA);
      assertEqual(buffer[13], 0x55);
    });

    runner.test('should deserialize from buffer', () => {
      const original = new ArtNetPoll(0x02, 0x01);
      const buffer = original.toBuffer();

      const parsed = ArtNetPoll.fromBuffer(buffer);
      assertEqual(parsed.opCode, OpCodes.POLL);
      assertEqual(parsed.protVerHi, 0);
      assertEqual(parsed.protVerLo, 14);
      assertEqual(parsed.flags, 0x02);
      assertEqual(parsed.priority, 0x01);
    });

    runner.test('should round-trip packet', () => {
      const original = new ArtNetPoll(0x03, 0x02);
      const buffer = original.toBuffer();
      const parsed = ArtNetPoll.fromBuffer(buffer);
      const buffer2 = parsed.toBuffer();

      assertBuffer(buffer, buffer2);
    });

    runner.test('should set targeted mode flag', () => {
      const packet = new ArtNetPoll();
      packet.setTargetedMode(true);
      assertEqual(packet.getFlag(0), true);

      packet.setTargetedMode(false);
      assertEqual(packet.getFlag(0), false);
    });

    runner.test('should set VLC transmission flag', () => {
      const packet = new ArtNetPoll();
      packet.setVlcTransmission(true);
      assertEqual(packet.getFlag(1), false); // Note: 1 = disable

      packet.setVlcTransmission(false);
      assertEqual(packet.getFlag(1), true);
    });

    runner.test('should return correct size', () => {
      const packet = new ArtNetPoll();
      assertEqual(packet.getSize(), 14);
    });

    runner.test('should throw on buffer too small', () => {
      const smallBuffer = Buffer.alloc(10);
      try {
        ArtNetPoll.fromBuffer(smallBuffer);
        throw new Error('Should have thrown');
      } catch (err) {
        assertEqual(err.message.includes('too small'), true);
      }
    });

    return await runner.run();
  }
}

(async () => {
  const result = await TestArtNetPoll.run();
  process.exit(result ? 0 : 1);
})();
