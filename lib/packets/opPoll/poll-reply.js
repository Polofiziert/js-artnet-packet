const { Buffer } = require('node:buffer');
const {ArtNetConstants} = require('../../constants');
const {AT_OPCODES, AT_REPORT_CODES, AT_STYLE_CODES, AT_OEM_CODES, AT_PRIORITY_CODES} = require('../../codes');
const {ArtNetMinPacket} = require("../packets");
const { buffer } = require('node:stream/consumers');

class ArtPollReplyPacket extends ArtNetMinPacket {
    constructor(){
        super(AT_OPCODES[1].code)
    }

    toBuffer() {
        const buf = Buffer.alloc(240) // 10 bytes minHeader; 197 bytes minPacketLength + 16 bytes ArtNet4 + 10 bytes Reserve
        var offset = this.writeMinHeader(buf)


        return buf
    }
}

module.exports = {
    ArtPollReplyPacket,
}