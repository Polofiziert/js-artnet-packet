const {AT_OPCODES, AT_REPORT_CODES, AT_STYLE_CODES, AT_OEM_CODES} = require('./codes');
const {ArtNetConstants} = require("./constants");
const {ArtNetMinPacket, ArtNetPacket} = require("./packets/packets");
const {ArtPollPacket, ArtPollReplyPacket} = require("./packets/index");

const dgram = require("node:dgram")

const basicConf = {
    name: {
        short: "jap-instance",
        long: "Jet another ArtNet packet - Instance Default"
    },
    style: "controller",

}

class ArtNetInstance {
    constructor(conf, socket){
        if(typeof conf == "string"){
            basicConf.name.long = conf
            basicConf.name.short = conf
            this.conf = basicConf
        }
        if(typeof conf == "object"){
            this.conf = conf
        }
        if(typeof socket == "object"){
            this.socket = socket
        }
        
    }

    sendDmx(){
        return new Error("Needs to be Implemented")
    }




}


module.exports = {
    ArtNetInstance
}