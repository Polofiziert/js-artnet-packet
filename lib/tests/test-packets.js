// These test should try to use the basic ArtNetPacket objects and test their functions
// It looks if vales are returned without errors and if they are as expected
// for futher infos https://nodejs.org/en/learn/test-runner/using-test-runner
// and https://nodejs.org/api/test.html#subtests

const assert = require('node:assert');
const test = require('node:test');

const { Buffer } = require('node:buffer');
const {ArtNetConstants} = require('../constants');
const {AT_OPCODES, AT_REPORT_CODES, AT_STYLE_CODES, AT_OEM_CODES} = require('../codes');
const {ArtNetMinPacket, ArtNetPacket} = require("../packets");



test('that 1 is equal 1', () => {
  assert.strictEqual(1, 1);
});

test('ArtNetMinPacket obj works corectly', (t) => {
    t.test('Object is createt and filled corectly | opCode 0x2000 [0]', () => {
        var artMinPack = new ArtNetMinPacket(AT_OPCODES[0].code);
        assert.strictEqual(artMinPack.id, "Art-Net\0");
        assert.strictEqual(artMinPack.opCode, 0x2000);
    });

    t.test('writeMinHeader func works corectly', (t) => {
        t.test('opCode 0x2000 [0] opPoll', () => {
            const bufActual = Buffer.alloc(10)
            var artMinPack = new ArtNetPacket(AT_OPCODES[0].code);
            var offset = artMinPack.writeMinHeader(bufActual)

            const opPoll = [0x41, 0x72, 0x74, 0x2d, 0x4e, 0x65, 0x74, 0x00, 0x00, 0x20]
            const bufExpected = Buffer.from(opPoll)
            
            assert.deepStrictEqual(bufActual, bufExpected);
            assert.strictEqual(offset, 10);
        });
        t.test('opCode 0x2100 [1] opPollReply', () => {
            const bufActual = Buffer.alloc(10)
            var artMinPack = new ArtNetPacket(AT_OPCODES[1].code);
            var offset = artMinPack.writeMinHeader(bufActual)

            const opPollReply = [0x41, 0x72, 0x74, 0x2d, 0x4e, 0x65, 0x74, 0x00, 0x00, 0x21]
            const bufExpected = Buffer.from(opPollReply)
            
            assert.deepStrictEqual(bufActual, bufExpected);
            assert.strictEqual(offset, 10);
        });
        t.test('opCode 0x5000 [6] opDmx', () => {
            const bufActual = Buffer.alloc(10)
            var artMinPack = new ArtNetPacket(AT_OPCODES[6].code);
            var offset = artMinPack.writeMinHeader(bufActual)

            const opDmx = [0x41, 0x72, 0x74, 0x2d, 0x4e, 0x65, 0x74, 0x00, 0x00, 0x50]
            const bufExpected = Buffer.from(opDmx)
            
            assert.deepStrictEqual(bufActual, bufExpected);
            assert.strictEqual(offset, 10);
        });
        
        t.test('Implement missing opCodes', (t) => {
            t.todo('eventualy we can do this with an for loop of opcodes in wich the expected buffer gets manipultated');
            //throw new Error('this does not fail the test');
        }); 

        t.test('Error for to small buffer', () => {
            const bufActual = Buffer.alloc(9)
            var artMinPack = new ArtNetMinPacket(AT_OPCODES[0].code);
            
            assert.throws(() => artMinPack.writeMinHeader(bufActual), Error("Buffer to small or not set, buffer.lenght >= 10 bytes."));
        });
    });

    t.test('readMinHeader func works corectly', (t) => {
        t.test('opCode 0x5000 [6] opDmx', () => {
            var artMinPack = new ArtNetMinPacket(AT_OPCODES[0].code);
            assert.strictEqual(artMinPack.id, "Art-Net\0");
            assert.strictEqual(artMinPack.opCode, 0x2000);

            const bufOpDmx = Buffer.from([0x41, 0x72, 0x74, 0x2d, 0x4e, 0x65, 0x74, 0x00, 0x00, 0x50])
            var offset = artMinPack.readMinHeader(bufOpDmx)

            assert.strictEqual(artMinPack.id, "Art-Net\0");
            assert.strictEqual(artMinPack.opCode, 0x5000);
        });
        t.test('Error for to small buffer', () => {
            var artMinPack = new ArtNetMinPacket(AT_OPCODES[0].code);
            assert.strictEqual(artMinPack.id, "Art-Net\0");
            assert.strictEqual(artMinPack.opCode, 0x2000);

            const bufOpDmx = Buffer.from([0x41, 0x72, 0x74, 0x2d, 0x4e, 0x65, 0x74, 0x00, 0x00])
            //var offset = artMinPack.readMinHeader(bufOpDmx)

            assert.throws(() => artMinPack.readMinHeader(bufOpDmx), Error("Buffer to small or not set, buffer.lenght >= 10 bytes."));
        });
        t.test('Error for missing ID im buffer', () => {
            var artMinPack = new ArtNetMinPacket(AT_OPCODES[0].code);
            assert.strictEqual(artMinPack.id, "Art-Net\0");
            assert.strictEqual(artMinPack.opCode, 0x2000);

            const bufOpDmx = Buffer.from([0x43, 0x72, 0x74, 0x2d, 0x4e, 0x65, 0x74, 0x00, 0x00, 0x50])
            //var offset = artMinPack.readMinHeader(bufOpDmx)

            assert.throws(() => artMinPack.readMinHeader(bufOpDmx), Error("Art-Net ID (Art-Net\x00) not found in Packet! ID Found: " + bufOpDmx.toString('utf8', 0, 0+8) + " ;"));
        });
    });

    t.test('Dummy functions throw error', (t) =>{
        t.test('toBuffer needs to be set by Child', () =>{
            var artMinPacket = new ArtNetMinPacket(AT_OPCODES[0].code);
            assert .throws(()=> artMinPacket.toBuffer(), Error)
        });
        t.test('fromBuffer needs to be set by Child', () =>{
            var artMinPacket = new ArtNetMinPacket(AT_OPCODES[0].code);
            assert .throws(()=> artMinPacket.fromBuffer(), Error)
        });
        t.test('getSize needs to be set by Child', () =>{
            var artMinPacket = new ArtNetMinPacket(AT_OPCODES[0].code);
            assert .throws(()=> artMinPacket.getSize(), Error)
        });
    });
});









test('ArtNetPacket obj works corectly', (t) => {
    t.test('Object is created and filled corectly | opCode 0x2000 [0]', () => {
        var artPack = new ArtNetPacket(AT_OPCODES[3].code);
        assert.strictEqual(artPack.id, "Art-Net\0");
        assert.strictEqual(artPack.opCode, 9216);
        assert.strictEqual(artPack.protVerHi, 0);
        assert.strictEqual(artPack.protVerLo, 14);
    });
    t.test('writeHeader func works corectly', (t) => {
        t.test('opCode 0x2000 [0] opPull', (t) => {
            var opPull = [0x41, 0x72, 0x74, 0x2d, 0x4e, 0x65, 0x74, 0x00, 0x00, 0x20, 0x00, 0x0e]
            var bufExpected = Buffer.from(opPull)
            var bufActual = Buffer.alloc(12)

            var artPack = new ArtNetPacket(AT_OPCODES[0].code);

            var offset = artPack.writeHeader(bufActual)

            assert.deepStrictEqual(bufActual, bufExpected)
            assert.strictEqual(offset, 12)
        });
        t.test('opCode 0x5000 [6] opDmx', (t) => {
            var opPull = [0x41, 0x72, 0x74, 0x2d, 0x4e, 0x65, 0x74, 0x00, 0x00, 0x50, 0x00, 0x0e]
            var bufExpected = Buffer.from(opPull)
            var bufActual = Buffer.alloc(12)

            var artPack = new ArtNetPacket(AT_OPCODES[6].code);

            var offset = artPack.writeHeader(bufActual)

            assert.deepStrictEqual(bufActual, bufExpected)
            assert.strictEqual(offset, 12)
        });

        t.test('Implement missing opCodes', (t) => {
            t.todo('eventualy we can do this with an for loop of opcodes in wich the expected buffer gets manipultated');
            //throw new Error('this does not fail the test');
        }); 
        
        t.test('Error for to small buffer', () => {
            const bufActual = Buffer.alloc(9)
            var artPack = new ArtNetPacket(AT_OPCODES[6].code);
            
            assert.throws(() => artPack.writeHeader(bufActual), Error("Buffer to small or not set, buffer.lenght >= 12 bytes."));
        });
    });

    t.test('readHeader func works corectly', (t) => {
        t.test('opCode 0x5000 [6] opDmx', () => {
            var artPack = new ArtNetPacket(AT_OPCODES[0].code);
            assert.strictEqual(artPack.id, "Art-Net\0");
            assert.strictEqual(artPack.opCode, 0x2000);
            assert.strictEqual(artPack.protVerHi, 0);
            assert.strictEqual(artPack.protVerLo, 14);

            const bufOpDmx = Buffer.from([0x41, 0x72, 0x74, 0x2d, 0x4e, 0x65, 0x74, 0x00, 0x00, 0x50, 0x10, 0x0f])
            var offset = artPack.readHeader(bufOpDmx)

            assert.strictEqual(artPack.id, "Art-Net\0");
            assert.strictEqual(artPack.opCode, 0x5000);
            assert.strictEqual(artPack.protVerHi, 16);
            assert.strictEqual(artPack.protVerLo, 15);
        });
        t.test('Error for small buffer', () => {
            var artPack = new ArtNetPacket(AT_OPCODES[0].code);

            const bufOpDmx = Buffer.from([0x41, 0x72, 0x74, 0x2d, 0x4e, 0x65, 0x74, 0x00, 0x00, 0x50])
            // var offset = artPack.readHeader(bufOpDmx)

            assert.throws(() => artPack.readHeader(bufOpDmx), Error("Buffer to small or not set, buffer.lenght >= 12 bytes."));
        });
        t.test('Error for missing ID in buffer', () => {
            var artPack = new ArtNetPacket(AT_OPCODES[0].code);

            const bufOpDmx = Buffer.from([0x41, 0x90, 0x74, 0x2d, 0x4e, 0x65, 0x74, 0x00, 0x00, 0x50, 0x00, 0x0e])
            // var offset = artPack.readHeader(bufOpDmx)

            assert.throws(() => artPack.readHeader(bufOpDmx), Error("Art-Net ID (Art-Net\x00) not found in Packet! ID Found: " + bufOpDmx.toString('utf8', 0, 0+8) + " ;"));
        });
    });
});

/*
test('that throws as 1 is not equal 2', () => {
  // throws an exception because 1 != 2
  assert.strictEqual(1, 2);
});
*/

// run with `node tests.mjs`


/* exampe paclets from wireshark

- ArtPoll       
| 41 72 74 2d 4e 65 74 00 00 20 - minHeader
| 41 72 74 2d 4e 65 74 00 00 20 00 0e - Header

0000   ff ff ff ff ff ff 00 e0 4c 6a 3c ab 08 00 45 00   ........Lj<...E.
0010   00 32 d2 4d 00 00 80 11 00 00 c0 a8 01 66 c0 a8   .2.M.........f..
0020   01 ff 19 36 19 36 00 1e 84 e5 
                                     41 72 74 2d 4e 65   ...6.6....Art-Ne
0030   74 00 00 20 00 0e 06 00 7f ff 00 00 53 79 22 69   t.. ........Sy"i


- ArtPolReply   
| 41 72 74 2d 4e 65 74 00 00 21 - minHeader
| 41 72 74 2d 4e 65 74 00 00 21 00 0e - Header

0000   ff ff ff ff ff ff 00 e0 4c 6a 3c ab 08 00 45 00   ........Lj<...E.
0010   01 0c d2 4e 00 00 80 11 00 00 c0 a8 01 66 c0 a8   ...N.........f..
0020   01 ff 19 36 19 36 00 f8 85 bf 
                                     41 72 74 2d 4e 65   ...6.6....Art-Ne
0030   74 00 00 21 c0 a8 01 66 36 19 04 30 00 00 22 69   t..!...f6..0.."i
0040   00 00 79 53 44 4d 58 2d 57 6f 72 6b 73 68 6f 70   ..ySDMX-Workshop
0050   00 00 00 00 00 00 44 4d 58 2d 57 6f 72 6b 73 68   ......DMX-Worksh
0060   6f 70 00 00 00 00 00 00 00 00 00 00 00 00 00 00   op..............
0070   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0080   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0090   00 00 00 00 00 00 23 30 30 30 31 20 5b 30 30 30   ......#0001 [000
00a0   31 5d 20 50 6f 77 65 72 20 4f 6e 20 54 65 73 74   1] Power On Test
00b0   73 20 50 61 73 73 2e 00 00 00 00 00 00 00 00 00   s Pass..........
00c0   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
00d0   00 00 00 00 00 00 00 01 40 00 00 00 00 00 00 00   ........@.......
00e0   00 00 00 00 01 00 00 00 00 00 00 00 00 00 00 00   ................
00f0   00 00 00 00 e0 4c 6a 3c ab c0 a8 01 66 01 00 00   .....Lj<....f...
0100   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0110   00 00 00 00 00 00 00 00 00 00                     ..........

- ArtDmx        
| 41 72 74 2d 4e 65 74 00 00 50 - minHeader
| 41 72 74 2d 4e 65 74 00 00 50 00 0e - Header

0000   00 e0 4c 6a 3c ab 6c 1f f7 5a 6d 28 08 00 45 00   ..Lj<.l..Zm(..E.
0010   02 2e 19 e8 00 00 40 11 da bc c0 a8 01 64 c0 a8   ......@......d..
0020   01 66 fd dc 19 36 02 1a e6 28 
                                     41 72 74 2d 4e 65   .f...6...(Art-Ne
0030   74 00 00 50 00 0e 00 00 00 00 02 00 00 00 00 00   t..P............
0040   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0050   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0060   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0070   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0080   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0090   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
00a0   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
00b0   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
00c0   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
00d0   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
00e0   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
00f0   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0100   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0110   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0120   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0130   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0140   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0150   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0160   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0170   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0180   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0190   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
01a0   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
01b0   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
01c0   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
01d0   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
01e0   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
01f0   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0200   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0210   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0220   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0230   00 00 00 00 00 00 00 00 00 00 00 00               ............


*/