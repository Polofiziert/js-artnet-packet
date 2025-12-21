const { ArtNetPackets } = require("./packets")
const { pollSchema } = require("./schemas/opPoll")
const { ArtNetCodes } = require("../codes/")
const {MappedBitfield, FixedString, MappedEnum} = require('./schemas/fieldTypeExtention')


let pollData = {
    id: "Art-Net\0",
    opCode: 0x2000,
    protoVer: [4,48],
    // Packet Begins
    flags: {
        targetedMode: "off", 
        vlcTransmission: "on", 
        broadcastDignostics: "yes", 
        sendDiagnostics: "yes", 
        sendOnChange: "on" 
    },
    diagPriority: "dpVolatile",
    // Min packet lenght for valid artPollReply Packet, following fields are Art-Net4 Specific
    targetPortAddress: [0,0,0,1],
    estaMan: [0,1],
    oem: [0,1],
}

class PollPacket extends ArtNetPackets{
    constructor(){
        super(pollSchema, 14),
        this.data = pollData
    }

    encode (){
        //console.log("encoding")
        // this._increntCounters(); -> Has no Counters
        return this.schema.toBuffer(this.data)
    }

}

module.exports = {
    PollPacket
}