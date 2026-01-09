/*
PacketParser
Identifies the packet type (OpCode)
Routes to appropriate packet class
Calls decode() on that class
Returns typed packet instance
*/

const { ArtNetCodes } = require("../codes/")
const { PollPacket } = require("../packets/pollPacket")
const { PollReplyPacket } = require("../packets/pollReplyPacket")

class packetParser {
    constructor(){

    }

    parse (buffer){
        if(this.isArtnet(buffer)) {
            let opCode = buffer.readInt16LE(8)
            opCode = ArtNetCodes.getOpCodeByCode(opCode)

            switch (opCode) {
                case "OpPoll":
                    let pollPacket = new PollPacket
                    pollPacket.decode(buffer)
                    return pollPacket
                case "OpPollReply":
                    let pollReplyPacket = new PollReplyPacket
                    pollReplyPacket.decode(buffer)
                    return pollReplyPacket
                default:
                    return {err: "", msg: buffer}
            }

        }else{
            return {err: "not Art-Net protocol", msg: buffer}
        }
    }

    isArtnet (buffer){
        let isArtnet = false
        let artnetId = buffer.toString('utf8', 0, 7)

        artnetId == "Art-Net" ? isArtnet = true : null

        return isArtnet
    }
}


module.exports = {
    packetParser
}