/**
 * BufferSerializer Tests
 */

const { TestRunner, assertEqual, assertInstanceOf } = require('../test-utils');
const BufferSerializer = require('../../serializers/BufferSerializer');
const { ArtNetDMX, ArtNetPoll, ArtNetPollReply } = require('../../packets');

class TestBufferSerializer {
  static async run() {
    const runner = new TestRunner('BufferSerializer Tests');

    runner.test('should serialize packet to buffer', () => {
      const serializer = new BufferSerializer();
      const packet = new ArtNetDMX();
      packet.setChannel(0, 255);

      const buffer = serializer.serialize(packet);
      assertEqual(Buffer.isBuffer(buffer), true);
      assertEqual(buffer.length, 530);
    });

    runner.test('should deserialize buffer to packet', () => {
      const serializer = new BufferSerializer();
      const original = new ArtNetDMX(5, 1, 10);
      original.setChannel(0, 200);

      const buffer = serializer.serialize(original);
      const deserialized = serializer.deserialize(buffer);

      assertInstanceOf(deserialized, ArtNetDMX);
      assertEqual(deserialized.sequence, 5);
      assertEqual(deserialized.universe, 10);
      assertEqual(deserialized.getChannel(0), 200);
    });

    runner.test('should handle round-trip serialization', () => {
      const serializer = new BufferSerializer();
      const original = new ArtNetDMX();
      original.setChannels(0, [255, 128, 64, 32]);

      const buffer1 = serializer.serialize(original);
      const parsed = serializer.deserialize(buffer1);
      const buffer2 = serializer.serialize(parsed);

      assertEqual(buffer1.equals(buffer2), true);
    });

    runner.test('should serialize different packet types', () => {
      const serializer = new BufferSerializer();

      const poll = new ArtNetPoll();
      const pollBuffer = serializer.serialize(poll);
      assertEqual(pollBuffer.length, 14);

      const pollReply = new ArtNetPollReply();
      const pollReplyBuffer = serializer.serialize(pollReply);
      assertEqual(pollReplyBuffer.length, 239);

      const dmx = new ArtNetDMX();
      const dmxBuffer = serializer.serialize(dmx);
      assertEqual(dmxBuffer.length, 530);
    });

    runner.test('should throw on invalid packet', () => {
      const serializer = new BufferSerializer();
      try {
        serializer.serialize(null);
        throw new Error('Should have thrown');
      } catch (err) {
        assertEqual(err.message.includes('toBuffer'), true);
      }

      try {
        serializer.serialize({ notAPacket: true });
        throw new Error('Should have thrown');
      } catch (err) {
        assertEqual(err.message.includes('toBuffer'), true);
      }
    });

    runner.test('should throw on invalid buffer', () => {
      const serializer = new BufferSerializer();
      try {
        serializer.deserialize('not a buffer');
        throw new Error('Should have thrown');
      } catch (err) {
        assertEqual(err.message.includes('Buffer'), true);
      }
    });

    return await runner.run();
  }
}

(async () => {
  const result = await TestBufferSerializer.run();
  process.exit(result ? 0 : 1);
})();
