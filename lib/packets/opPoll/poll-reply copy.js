const { Buffer } = require('node:buffer');
const {ArtNetConstants} = require('../../constants');
const {AT_OPCODES, AT_REPORT_CODES, AT_STYLE_CODES, AT_OEM_CODES, AT_PRIORITY_CODES} = require('../../codes');
const {ArtNetMinPacket} = require("../packets");
const { buffer } = require('node:stream/consumers');

class ArtPollReplyPacket extends ArtNetMinPacket {
    constructor(){
        super(AT_OPCODES[1].code)
        this.fields = {
            ipAddress : [192, 168, 1, 102],
            port : ArtNetConstants.AT_PORT,
            versionInfoH : 0,
            versionInfoL : 1,
            netSwitch : 0x7f,
            subSwitch : 0x00,
            oemHi : 0x22,
            oemLo : 0x69,
            ubeaVersion : 0,
            status1 : {
                ubeaPresent : false,
                rdmCapable : false,
                bootedFromRom : false,
                // Not implmented Bit 3
                portAddressProgrammingAuthority : {
                    unknown : [true, 0],
                    frontPanel : [false, 1],
                    network : [false, 2],
                    // not used, allways 0 / false
                },
                indicatorState : {
                    unknown : [true, 0], // [state, value]
                    identify : [false, 1],
                    muteMode : [false, 2],
                    normalMode : [false, 4],
                },
            },
            estaManLo : 0x53,
            estaManHi : 0x79,
            portName : "DMX-Workshop",
            longName : "DMX-Workshop",
            nodeReport : "#0x0008 [0021] Polofiziert...",
            numPortsHi : 0x00, //the high byte is for future expansion and is currently zero.
            numPortsLo : 0x04,
            portTypes : {  // 4 times
                canOutput : false, // Can Output DMX
                canInput : false,  // Can Input ArtNet
                protocol : {
                    dmx512 : [false, 0],
                    midi : [false, 1],
                    avab : [false, 2],
                    colortranCMX : [false, 3],
                    adb62_5 : [false, 4],
                    artNet : [true, 5],
                    dali : [false, 6],
                }
            },
            goodInput : { // 4 times
                dataRecived : false,
                dmxTestPackets : false,
                dmxSIP : false,
                dmxTextPackets : false,
                inputDisabled : false,
                receiveErrors : false,
                //unused bit, allways 0 / false
                convertToAcn : false,
            },
            goodOutputA : { // 4 times
                dmxOutput : true,
                dmxTestPackets : false,
                dmxSIP : false,
                dmxTextPackets : false,
                isMerging : true,
                dmxShorted : false,
                mergeIsLtp : true,
                fromAcn : false,
            },
            swIn : 0xff,
            swOut : 0x00,
            acnPriority : 0x00,
            swMacro : {
                macro1 : false,
                macro2 : false,
                macro3 : false,
                macro4 : false,
                macro5 : false,
                macro6 : false,
                macro7 : false,
                macro8 : false,
            },
            swRemote : {
                remote1 : false,
                remote2 : false,
                remote3 : false,
                remote4 : false,
                remote5 : false,
                remote6 : false,
                remote7 : false,
                remote8 : false,
            },
            // Spare int 8
            // Spare int 8
            // Spare int 8
            styleCode : "StController",
            mac : [0x00, 0xe0, 0x4c, 0x6a, 0x3c, 0xab],
            bindIp : [192, 168, 1, 103],
            bindIndex : 0,
            status2 : {
                setOutputStyle : false,
                isSquaking : false,
                isArtOrAcn : false,
                is15bitAddress : true,
                isDhcp : true,
                isWebbased : false,
            },
            goodOutputB : { // 4 times
                rdmOff : true,
                isData : false,
                discoveryOff : false,
                backgroundDiscoveryOff : false,
                // Not Used set zero
                // Not Used set zero
                // Not Used set zero
                // Not Used set zero
            },
            status3 : {
                canSetbackgroundDiscovery : false,
                hasBackgroudnQueue : false,
                hasRdmNet : false,
                canSwitchPortDirection : false,
                hasLlrp : false,
                hasFailsafe : false,
                falilsafeState : {
                    hold : [true, 0],
                    zero : [false, 1],
                    full : [false, 2],
                    scene : [false, 3],
                }
            },
            defaultRespUi : [0, 0, 0, 0, 0, 0],
            userHi : 0,
            userLo : 0,
            refreshRateHi : 0,
            refreshRateLo : 44,
            backgroundQueuePolicy : {
                statusNone : [true, 0],
                statusAdvisory : [false, 1],
                statusWarning : [false, 2],
                statusError : [false, 3],
                disabled : [false, 4],
            },
            // Filler 10x int8
        }
    }

    toBuffer() {
        var buf = Buffer.alloc(240) // 10 minHeader; 197 minPacketLength + 16 ArtNet4 + 10 Reserve
        var offset = this.writeMinHeader(buf)
        var data = this.fields

        // IP Address | field 3 4xInt8
        offset = buf.writeUInt8(data.ipAddress[0], offset)
        offset = buf.writeUInt8(data.ipAddress[1], offset)
        offset = buf.writeUInt8(data.ipAddress[2], offset)
        offset = buf.writeUInt8(data.ipAddress[3], offset)

        // Port | field 4 Int16
        offset = buf.writeInt16LE(data.port, offset)
        // Version | field 5-6 H-L 2xInt8
        offset = buf.writeUInt8(data.versionInfoH, offset)
        offset = buf.writeUInt8(data.versionInfoL, offset)
        // Port Address | field 7-8 2xInt8
        offset = buf.writeUInt8(data.netSwitch, offset)
        offset = buf.writeUInt8(data.subSwitch, offset)
        // Oem | field 9-10 H-L 2xInt8
        offset = buf.writeUInt8(data.oemHi, offset)
        offset = buf.writeUInt8(data.oemLo, offset)
        // Ubea Version | field 11 Int8
        offset = buf.writeUInt8(data.ubeaVersion, offset)

        // Status 1 | field 12 Int8
        var status1Int = 0
        //  8.   7.  6.  5.          4. 3.      2. 1.      => number of bit in flags Integer
        //  0    0   0   0           0  0       0  0       => int8 each bit represents a flag
        //  1    2   4   8           16 32     64 128      => to add the numbers
        // ubea rdm firm -          portAuth  indicState   => used bits for flags
        // Calculating the flags int from the this.flags objects boleans, adding the value of the flipped bit for every true bolean
        data.status1.indicatorState.unknown[0] == true ? status1Int = status1Int + 0 : null
        data.status1.indicatorState.identify[0] == true ? status1Int = status1Int + 2 : null
        data.status1.indicatorState.muteMode[0] == true ? status1Int = status1Int + 1 : null
        data.status1.indicatorState.normalMode[0] == true ? status1Int = status1Int + 1 + 2 : null

        data.status1.portAddressProgrammingAuthority.unknown[0] == true ? status1Int = status1Int + 0 : null
        data.status1.portAddressProgrammingAuthority.frontPanel[0] == true ? status1Int = status1Int + 8 : null
        data.status1.portAddressProgrammingAuthority.network[0] == true ? status1Int = status1Int + 4 : null

        data.status1.bootedFromRom == true ? status1Int = status1Int + 32 : null
        data.status1.rdmCapable == true ? status1Int = status1Int + 64 : null
        data.status1.ubeaPresent == true ? status1Int = status1Int + 128 : null

        offset = buf.writeUInt8(status1Int, offset)

        console.log("___**_____________*_____*_____")

        // EstaMan | field 13-14 Lo-Hi 2xint8
        offset = buf.writeUInt8(data.estaManLo, offset)
        offset = buf.writeUInt8(data.estaManHi, offset)

        // PortName | field 15 18xint8
        buf.write(data.portName.substring(0,18).padEnd(18, "\0"), offset)
        offset = offset + 18 // Attention! buf.write returns the length of the written string, not the offset
        
        // LongName | field 16 64xint8
        buf.write(data.longName.substring(0,64).padEnd(64, "\0"), offset)
        offset = offset + 64 // Attention! buf.write returns the length of the written string, not the offset

        // Node Report | field 17 64xint8
        buf.write(data.nodeReport.substring(0,64).padEnd(64, "\0"), offset)
        offset = offset + 64 // Attention! buf.write returns the length of the written string, not the offset

        // NumPorts High | field 18-19 Hi-Lo 2xint8
        offset = buf.writeUInt8(data.numPortsHi, offset)
        offset = buf.writeUInt8(data.numPortsLo, offset)

        // Port Types | field 20 Int8
        var portTypeInt = 0
        //   7.     6.    5.  4.          3.    2.  1.  0.      => number of bit
        //   0      0     0   0           0     0   0   0       => int8 
        //   1      2     4   8           16    32  64 128      => to add the numbers
        // canOut canIn   -   -           -    protocolType     => used bits for flags
        data.portTypes.canOutput == true ? portTypeInt = portTypeInt + 1 : null 
        data.portTypes.canInput == true ? portTypeInt = portTypeInt + 2 : null 

        data.portTypes.protocol.dmx512[0] == true ? portTypeInt = portTypeInt + 0 : null 
        data.portTypes.protocol.midi[0] == true ? portTypeInt = portTypeInt + 128 : null 
        data.portTypes.protocol.avab[0] == true ? portTypeInt = portTypeInt + 64 : null 
        data.portTypes.protocol.colortranCMX[0] == true ? portTypeInt = portTypeInt + 64 + 128 : null 
        data.portTypes.protocol.adb62_5[0] == true ? portTypeInt = portTypeInt + 32 : null 
        data.portTypes.protocol.artNet[0] == true ? portTypeInt = portTypeInt + 32 + 128 : null 
        data.portTypes.protocol.dali[0] == true ? portTypeInt = portTypeInt + 32 + 64 : null 
        
        offset = buf.writeUInt8(portTypeInt, offset)

        

        return buf
    }
}

module.exports = {
    ArtPollReplyPacket,
}