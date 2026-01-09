// These test should try to use the basic ArtNetPacket objects and test their functions
// It looks if vales are returned without errors and if they are as expected
// for futher infos https://nodejs.org/en/learn/test-runner/using-test-runner
// and https://nodejs.org/api/test.html#subtests

const assert = require('node:assert');
const test = require('node:test');

const {toBinString, toBinStringPretty, toHexStringPretty, toHexString, toHexStringArray} = require('../../../helper');


const { Buffer } = require('node:buffer');

const { ArtNetCodes } = require("../../codes")
const { PollPacket } = require("../../packets/pollPacket")

test('pollPacket obj works corectly', (t) => {
    t.test('Object is createt and filled corectly | opCode 0x2000 [0]', () => {
        let packet = new PollPacket()
        assert.strictEqual(packet.data.id, "Art-Net"); // tests if the properties of the created obj populted corectly
        assert.strictEqual(packet.data.opCode, 0x2000);
    });

    t.test('encode() func works corectly', (t) => {
        let packet = new PollPacket()
        let bufExpected = new Uint8Array([65, 114, 116, 45, 78, 101, 116, 0, 0, 32, 4, 48, 28, 240, 0, 0, 0, 1, 0, 1, 0, 1])

        let bufActual = packet.encode()
        assert.deepStrictEqual(bufActual, bufExpected)
    });

    t.test('encode() func works corectly with changed data', (t) => {
        let packet = new PollPacket()
        packet.data.flags.targetedMode = 'on'
        let bufExpected = new Uint8Array([65, 114, 116, 45, 78, 101, 116, 0, 0, 32, 4, 48, 60, 240, 0, 0, 0, 1, 0, 1, 0, 1])

        let bufActual = packet.encode()
        assert.deepStrictEqual(bufActual, bufExpected)
    });

    t.test('decode() func works corectly backAndForth', (t) => {
        let packetExp = new PollPacket()
        let packetAct = new PollPacket()
        //let buf = new Uint8Array([0x41, 0x72, 0x74, 0x2d, 0x4e, 0x65, 0x74, 0x00, 0x00, 0x20, 0x04, 0x30, 0x1c, 0xf0, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01])
        let buf = packetExp.encode()

        let packetActData = packetAct.decode(buf)
        assert.deepStrictEqual(packetActData, packetExp.data)
        assert.deepStrictEqual(packetAct, packetExp)
    });

    t.test('decode() func works corectly back', (t) => {
        let packetExp = new PollPacket()
        let packetAct = new PollPacket()
        let buf = new Uint8Array([0x41, 0x72, 0x74, 0x2d, 0x4e, 0x65, 0x74, 0x00, 0x00, 0x20, 0x04, 0x30, 0x1c, 0xf0, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01])
        //let buf = packetExp.encode()

        let packetActData = packetAct.decode(buf)
        assert.deepStrictEqual(packetActData, packetExp.data)
        assert.deepStrictEqual(packetAct, packetExp)
    });

});
