/**
 * JsonSerializer Tests
 */

const { TestRunner, assertEqual } = require('../test-utils');
const JsonSerializer = require('../../serializers/JsonSerializer');
const { ArtNetDMX, ArtNetPoll } = require('../../packets');

class TestJsonSerializer {
  static async run() {
    const runner = new TestRunner('JsonSerializer Tests');

    runner.test('should serialize packet to JSON string', () => {
      const serializer = new JsonSerializer();
      const packet = new ArtNetDMX();

      const json = serializer.serialize(packet);
      assertEqual(typeof json, 'string');
      assertEqual(json.includes('ArtNetDMX'), true);
    });

    runner.test('should deserialize JSON string', () => {
      const serializer = new JsonSerializer();
      const jsonStr = '{"type": "test", "value": 123}';

      const obj = serializer.deserialize(jsonStr);
      assertEqual(obj.type, 'test');
      assertEqual(obj.value, 123);
    });

    runner.test('should convert packet to object', () => {
      const serializer = new JsonSerializer();
      const packet = new ArtNetDMX(10, 1, 5);
      packet.setChannel(0, 255);

      const obj = serializer.packetToObject(packet);
      assertEqual(obj.type, 'ArtNetDMX');
      assertEqual(obj.opCode, '0x5000');
      assertEqual(obj.sequence, 10);
      assertEqual(obj.universe, 5);
    });

    runner.test('should include ProtVer in object', () => {
      const serializer = new JsonSerializer();
      const packet = new ArtNetPoll();

      const obj = serializer.packetToObject(packet);
      assertEqual(obj.protVer.hi, 0);
      assertEqual(obj.protVer.lo, 14);
    });

    runner.test('should convert buffer fields', () => {
      const serializer = new JsonSerializer();
      const packet = new ArtNetDMX();

      const obj = serializer.packetToObject(packet);
      assertEqual(typeof obj.dmxData, 'string');
      assertEqual(obj.dmxData.includes('Buffer'), true);
    });

    runner.test('should handle round-trip (deserialize JSON)', () => {
      const serializer = new JsonSerializer();
      const original = new ArtNetDMX();

      const json = serializer.serialize(original);
      const obj = serializer.deserialize(json);

      assertEqual(obj.type, 'ArtNetDMX');
      assertEqual(typeof obj.opCode, 'string');
    });

    runner.test('should throw on invalid JSON', () => {
      const serializer = new JsonSerializer();
      try {
        serializer.deserialize('{ invalid json }');
        throw new Error('Should have thrown');
      } catch (err) {
        assertEqual(err.message.includes('Invalid JSON'), true);
      }
    });

    runner.test('should throw on non-string input', () => {
      const serializer = new JsonSerializer();
      try {
        serializer.deserialize(123);
        throw new Error('Should have thrown');
      } catch (err) {
        assertEqual(err.message.includes('string'), true);
      }
    });

    runner.test('should handle null packet gracefully', () => {
      const serializer = new JsonSerializer();
      try {
        serializer.serialize(null);
        throw new Error('Should have thrown');
      } catch (err) {
        assertEqual(err.message.includes('null'), true);
      }
    });

    return await runner.run();
  }
}

(async () => {
  const result = await TestJsonSerializer.run();
  process.exit(result ? 0 : 1);
})();
