/**
 * Base Packet Class Tests
 */

const { TestRunner, assertEqual, assertBuffer, assertThrows } = require('../test-utils');
const { ArtNetPacket, ArtNetReplyPacket } = require('../../packets/base');
const { OpCodes } = require('../../constants');

class TestArtNetPacket {
  static async run() {
    const runner = new TestRunner('ArtNetPacket Tests');

    runner.test('should create packet with default values', () => {
      const packet = new ArtNetPacket(OpCodes.POLL);
      assertEqual(packet.opCode, OpCodes.POLL);
      assertEqual(packet.protVerHi, 0);
      assertEqual(packet.protVerLo, 14);
    });

    runner.test('should create packet with custom protocol version', () => {
      const packet = new ArtNetPacket(OpCodes.POLL, 1, 15);
      assertEqual(packet.protVerHi, 1);
      assertEqual(packet.protVerLo, 15);
    });

    runner.test('should write common header correctly', () => {
      const packet = new ArtNetPacket(OpCodes.OUTPUT, 0, 14);
      const buffer = Buffer.alloc(12);
      const offset = packet.writeCommonHeader(buffer, 0);

      // Check ID
      assertEqual(buffer.toString('ascii', 0, 7), 'Art-Net');
      assertEqual(buffer[7], 0);

      // Check OpCode (little-endian)
      assertEqual(buffer.readUInt16LE(8), OpCodes.OUTPUT);

      // Check protocol version
      assertEqual(buffer[10], 0);
      assertEqual(buffer[11], 14);

      // Check returned offset
      assertEqual(offset, 12);
    });

    runner.test('should read common header correctly', () => {
      const buffer = Buffer.alloc(12);
      buffer.write('Art-Net\0', 0, 8, 'ascii');
      buffer.writeUInt16LE(OpCodes.OUTPUT, 8);
      buffer[10] = 0;
      buffer[11] = 14;

      const packet = new ArtNetPacket(0);
      const offset = packet.readCommonHeader(buffer, 0);

      assertEqual(packet.opCode, OpCodes.OUTPUT);
      assertEqual(packet.protVerHi, 0);
      assertEqual(packet.protVerLo, 14);
      assertEqual(offset, 12);
    });

    runner.test('should validate protocol version', () => {
      const packet = new ArtNetPacket(OpCodes.POLL);
      assertEqual(packet.isValidProtocolVersion(), true);

      packet.protVerLo = 13;
      assertEqual(packet.isValidProtocolVersion(), false);
    });

    runner.test('should throw when toBuffer not implemented', () => {
      const packet = new ArtNetPacket(OpCodes.POLL);
      assertThrows(() => packet.toBuffer(), 'toBuffer() must be implemented by subclass');
    });

    runner.test('should throw when fromBuffer not implemented', () => {
      assertThrows(() => ArtNetPacket.fromBuffer(Buffer.alloc(14)), 'fromBuffer() must be implemented by subclass');
    });

    return await runner.run();
  }
}

class TestArtNetReplyPacket {
  static async run() {
    const runner = new TestRunner('ArtNetReplyPacket Tests');

    runner.test('should create reply packet without protocol version', () => {
      const packet = new ArtNetReplyPacket(OpCodes.POLL_REPLY);
      assertEqual(packet.opCode, OpCodes.POLL_REPLY);
      assertEqual(typeof packet.protVerHi, 'undefined');
      assertEqual(typeof packet.protVerLo, 'undefined');
    });

    runner.test('should write common header without ProtVer', () => {
      const packet = new ArtNetReplyPacket(OpCodes.POLL_REPLY);
      const buffer = Buffer.alloc(10);
      const offset = packet.writeCommonHeader(buffer, 0);

      // Check ID
      assertEqual(buffer.toString('ascii', 0, 7), 'Art-Net');
      assertEqual(buffer[7], 0);

      // Check OpCode
      assertEqual(buffer.readUInt16LE(8), OpCodes.POLL_REPLY);

      // Check returned offset (only 10 bytes, no ProtVer)
      assertEqual(offset, 10);
    });

    runner.test('should read common header without ProtVer', () => {
      const buffer = Buffer.alloc(10);
      buffer.write('Art-Net\0', 0, 8, 'ascii');
      buffer.writeUInt16LE(OpCodes.POLL_REPLY, 8);

      const packet = new ArtNetReplyPacket(0);
      const offset = packet.readCommonHeader(buffer, 0);

      assertEqual(packet.opCode, OpCodes.POLL_REPLY);
      assertEqual(offset, 10);
    });

    return await runner.run();
  }
}

// Run all tests
(async () => {
  const result1 = await TestArtNetPacket.run();
  const result2 = await TestArtNetReplyPacket.run();
  process.exit(result1 && result2 ? 0 : 1);
})();
