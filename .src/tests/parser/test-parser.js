/**
 * PacketParser Tests
 */

const { TestRunner, assertEqual } = require('../test-utils');
const PacketParser = require('../../parser/PacketParser');
const { ArtNetPoll, ArtNetPollReply } = require('../../packets/discovery');
const { ArtNetDMX, ArtNetSync } = require('../../packets/dmx');
const { OpCodes, OpCodeNames } = require('../../constants');

class TestPacketParser {
  static async run() {
    const runner = new TestRunner('PacketParser Tests');

    runner.test('should identify ArtNetPoll packet', () => {
      const packet = new ArtNetPoll();
      const buffer = packet.toBuffer();
      const opCode = PacketParser.identify(buffer);
      assertEqual(opCode, OpCodes.POLL);
    });

    runner.test('should identify ArtNetDMX packet', () => {
      const packet = new ArtNetDMX();
      const buffer = packet.toBuffer();
      const opCode = PacketParser.identify(buffer);
      assertEqual(opCode, OpCodes.OUTPUT);
    });

    runner.test('should get opcode name', () => {
      assertEqual(PacketParser.getOpCodeName(OpCodes.POLL), 'ArtNetPoll');
      assertEqual(PacketParser.getOpCodeName(OpCodes.POLL_REPLY), 'ArtNetPollReply');
      assertEqual(PacketParser.getOpCodeName(OpCodes.OUTPUT), 'ArtNetDMX');
    });

    runner.test('should parse ArtNetPoll packet', () => {
      const original = new ArtNetPoll(0x02, 0x01);
      const buffer = original.toBuffer();

      const parsed = PacketParser.parse(buffer);
      assertEqual(parsed instanceof ArtNetPoll, true);
      assertEqual(parsed.flags, 0x02);
      assertEqual(parsed.priority, 0x01);
    });

    runner.test('should parse ArtNetPollReply packet', () => {
      const original = new ArtNetPollReply('192.168.1.1', 'Node1', 'Test Node');
      const buffer = original.toBuffer();

      const parsed = PacketParser.parse(buffer);
      assertEqual(parsed instanceof ArtNetPollReply, true);
      assertEqual(parsed.ipAddress, '192.168.1.1');
    });

    runner.test('should parse ArtNetDMX packet', () => {
      const original = new ArtNetDMX(10, 1, 5);
      original.setChannel(0, 255);
      const buffer = original.toBuffer();

      const parsed = PacketParser.parse(buffer);
      assertEqual(parsed instanceof ArtNetDMX, true);
      assertEqual(parsed.sequence, 10);
      assertEqual(parsed.universe, 5);
      assertEqual(parsed.getChannel(0), 255);
    });

    runner.test('should parse ArtNetSync packet', () => {
      const original = new ArtNetSync(0xAB, 0xCD);
      const buffer = original.toBuffer();

      const parsed = PacketParser.parse(buffer);
      assertEqual(parsed instanceof ArtNetSync, true);
      assertEqual(parsed.aux1, 0xAB);
      assertEqual(parsed.aux2, 0xCD);
    });

    runner.test('should check valid Art-Net packet', () => {
      const dmx = new ArtNetDMX();
      const buffer = dmx.toBuffer();

      assertEqual(PacketParser.isArtNetPacket(buffer), true);
    });

    runner.test('should reject invalid Art-Net packet', () => {
      const buffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      assertEqual(PacketParser.isArtNetPacket(buffer), false);
    });

    runner.test('should throw on invalid ID', () => {
      const buffer = Buffer.alloc(14);
      buffer.write('BadData', 0, 7);
      buffer.writeUInt16LE(OpCodes.POLL, 8);

      try {
        PacketParser.parse(buffer);
        throw new Error('Should have thrown');
      } catch (err) {
        assertEqual(err.message.includes('Invalid Art-Net ID'), true);
      }
    });

    runner.test('should throw on unknown opcode', () => {
      const buffer = Buffer.alloc(14);
      buffer.write('Art-Net\0', 0, 8, 'ascii');
      buffer.writeUInt16LE(0xFFFF, 8); // Invalid OpCode

      try {
        PacketParser.parse(buffer);
        throw new Error('Should have thrown');
      } catch (err) {
        assertEqual(err.message.includes('Unknown'), true);
      }
    });

    runner.test('should throw on buffer too small', () => {
      const buffer = Buffer.alloc(5);

      try {
        PacketParser.parse(buffer);
        throw new Error('Should have thrown');
      } catch (err) {
        assertEqual(err.message.includes('too small'), true);
      }
    });

    return await runner.run();
  }
}

(async () => {
  const result = await TestPacketParser.run();
  process.exit(result ? 0 : 1);
})();
