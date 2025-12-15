/**
 * ArtNetPollReply Packet Tests
 */

const { TestRunner, assertEqual, assertBufferLength } = require('../test-utils');
const ArtNetPollReply = require('../../packets/discovery/ArtNetPollReply');
const { OpCodes } = require('../../constants');

class TestArtNetPollReply {
  static async run() {
    const runner = new TestRunner('ArtNetPollReply Packet Tests');

    runner.test('should create poll reply packet with defaults', () => {
      const packet = new ArtNetPollReply();
      assertEqual(packet.opCode, OpCodes.POLL_REPLY);
      assertEqual(packet.ipAddress, '0.0.0.0');
      assertEqual(packet.nodeShortName, '');
      assertEqual(packet.nodeLongName, '');
      assertEqual(packet.numPorts, 4);
      assertEqual(typeof packet.protVerHi, 'undefined'); // NO ProtVer!
      assertEqual(typeof packet.protVerLo, 'undefined');
    });

    runner.test('should create poll reply with custom values', () => {
      const packet = new ArtNetPollReply('192.168.1.100', 'MyNode', 'My Test Node');
      assertEqual(packet.ipAddress, '192.168.1.100');
      assertEqual(packet.nodeShortName, 'MyNode');
      assertEqual(packet.nodeLongName, 'My Test Node');
    });

    runner.test('should truncate long names', () => {
      const longShort = 'A'.repeat(50);
      const longLong = 'B'.repeat(100);
      const packet = new ArtNetPollReply('0.0.0.0', longShort, longLong);

      assertEqual(packet.nodeShortName.length, 17);
      assertEqual(packet.nodeLongName.length, 63);
    });

    runner.test('should serialize to buffer (239 bytes)', () => {
      const packet = new ArtNetPollReply();
      const buffer = packet.toBuffer();
      assertBufferLength(buffer, 239);
    });

    runner.test('should serialize header without ProtVer', () => {
      const packet = new ArtNetPollReply();
      const buffer = packet.toBuffer();

      // Check ID
      assertEqual(buffer.toString('ascii', 0, 7), 'Art-Net');

      // Check OpCode
      assertEqual(buffer.readUInt16LE(8), OpCodes.POLL_REPLY);

      // IP Address comes directly after OpCode (offset 10)
      const ip = `${buffer[10]}.${buffer[11]}.${buffer[12]}.${buffer[13]}`;
      assertEqual(ip, '0.0.0.0');
    });

    runner.test('should serialize IP address correctly', () => {
      const packet = new ArtNetPollReply('192.168.1.100');
      const buffer = packet.toBuffer();

      assertEqual(buffer[10], 192);
      assertEqual(buffer[11], 168);
      assertEqual(buffer[12], 1);
      assertEqual(buffer[13], 100);
    });

    runner.test('should serialize port number', () => {
      const packet = new ArtNetPollReply();
      const buffer = packet.toBuffer();

      const port = buffer.readUInt16LE(14);
      assertEqual(port, 0x1936); // 6454
    });

    runner.test('should deserialize from buffer', () => {
      const original = new ArtNetPollReply('192.168.1.50', 'TestNode', 'Test Long Name');
      const buffer = original.toBuffer();

      const parsed = ArtNetPollReply.fromBuffer(buffer);
      assertEqual(parsed.opCode, OpCodes.POLL_REPLY);
      assertEqual(parsed.ipAddress, '192.168.1.50');
    });

    runner.test('should round-trip packet', () => {
      const original = new ArtNetPollReply('10.0.0.1', 'Node1', 'First Test Node');
      const buffer = original.toBuffer();
      const parsed = ArtNetPollReply.fromBuffer(buffer);
      const buffer2 = parsed.toBuffer();

      assertEqual(buffer.equals(buffer2), true);
    });

    runner.test('should get firmware version string', () => {
      const packet = new ArtNetPollReply();
      packet.versInfoHi = 1;
      packet.versInfoLo = 23;

      assertEqual(packet.getFirmwareVersion(), '1.23');
    });

    runner.test('should set firmware version', () => {
      const packet = new ArtNetPollReply();
      packet.setFirmwareVersion(2, 5);

      assertEqual(packet.versInfoHi, 2);
      assertEqual(packet.versInfoLo, 5);
      assertEqual(packet.getFirmwareVersion(), '2.5');
    });

    runner.test('should return correct size', () => {
      const packet = new ArtNetPollReply();
      assertEqual(packet.getSize(), 239);
    });

    runner.test('should throw on buffer too small', () => {
      const smallBuffer = Buffer.alloc(100);
      try {
        ArtNetPollReply.fromBuffer(smallBuffer);
        throw new Error('Should have thrown');
      } catch (err) {
        assertEqual(err.message.includes('too small'), true);
      }
    });

    return await runner.run();
  }
}

(async () => {
  const result = await TestArtNetPollReply.run();
  process.exit(result ? 0 : 1);
})();
