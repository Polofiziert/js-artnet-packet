const { Buffer } = require('node:buffer');
const {ArtNetConstants} = require('../../constants');
const {AT_OPCODES, AT_REPORT_CODES, AT_STYLE_CODES, AT_OEM_CODES, AT_PRIORITY_CODES} = require('../../codes');
const {ArtNetPacket} = require("../packets");
const { buffer } = require('node:stream/consumers');

class ArtPollPacket extends ArtNetPacket {
    constructor(){
        super(AT_OPCODES[0].code),
        this.flags = {
            targetedMode: false,
            vlcTransmission: false,
            isUnicastDiagnosticMessages: false, // 1 = Diagnostics messages are unicast.  0 = Diagnostics messages are broadcast.
            sendDiagnosticMessages: true,
            sendOnChangen: true, //1 = Send ArtPollReply whenever Node conditions change. 0 = Only send ArtPollReply in response to an ArtPoll or ArtAddress.
        },
        this.diagPriority = "DpAll",
        this.targetPortTopHi = 0x7f, // Port-Address for Targeted Mode, Net+Sub
        this.targetPortTopLo = 0xff,
        this.targetPortBottomHi = 0, // Port-Address for Targeted Mode, Net+Universe
        this.targetPortBottomLo = 0,
        this.estaManHi = 0x53, // TODO: Needs to come from Artnet instance / node / controller
        this.estaManLo = 0x79,
        this.oemHi = 0x22, // TODO: Needs to come from Artnet instance / node / controller
        this.oemLo = 0x69
    }

    toBuffer() {
        var buf = Buffer.alloc(22)
        var offset = this.writeHeader(buf)
        var flagsInt = 0
        var diagPriorityInt = 0

        // 1. 2. 3. 4.  5. 6. 7. 8.  => number of bit in flags Integer
        // 0  0  0  0   0  0  0  0   => int8 each bit represents a flag
        // 1  2  4  8   16 32 64 128 => to add the numbers
        // -  tM vT dM  dM oC -  -   => used bits for flags
        // Calculating the flags int from the this.flags objects boleans, adding the value of the flipped bit for every true bolean
        this.flags.targetedMode == true ? flagsInt = flagsInt + 32 : null
        this.flags.vlcTransmission == true ? flagsInt = flagsInt + 16 : null
        this.flags.isUnicastDiagnosticMessages == true ? flagsInt = flagsInt + 8 : null
        this.flags.sendDiagnosticMessages == true ? flagsInt = flagsInt + 4 : null
        this.flags.sendOnChangen == true ? flagsInt = flagsInt + 2 : null
        
        diagPriorityInt = AT_PRIORITY_CODES.find(prio => prio.name === this.diagPriority).code;
        
        // Protocol version Hi and Low Bytes
        offset = buf.writeUInt8(flagsInt, offset)
        offset = buf.writeUInt8(diagPriorityInt, offset)
        offset = buf.writeUInt8(this.targetPortTopHi, offset)
        offset = buf.writeUInt8(this.targetPortTopLo, offset)
        offset = buf.writeUInt8(this.targetPortBottomHi, offset)
        offset = buf.writeUInt8(this.targetPortBottomLo, offset)
        offset = buf.writeUInt8(this.estaManHi, offset)
        offset = buf.writeUInt8(this.estaManLo, offset)
        offset = buf.writeUInt8(this.oemHi, offset)
        offset = buf.writeUInt8(this.oemLo, offset)
        
        return buf
    }
}

module.exports = {
    ArtPollPacket,
}