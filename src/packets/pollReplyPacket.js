const { ArtNetPackets } = require("./packets")
const { pollReplySchema } = require("./schemas/opPollReply")
const { ArtNetCodes } = require("../codes/")
const {MappedBitfield, FixedString, MappedEnum} = require('./schemas/fieldTypeExtention')


let pollReplyData = {
        id: "Art-Net",
        opCode: 8448,
        ipAddress: [192, 168, 2, 114],
        port: 6454,
        versionInfo: [0, 1],  // Device Firmware Version Info
        netSwitch: 0,
        subSwitch: 0,
        oem: [0, 0],
        ubeaVersion: 0,
        status1: {
            indicator: "unknown",
            auth: "unknown",
            bootMode: "normal",
            isRdm: "no",
            hasUbea: "no",
        },
        estaMan: [0, 0],
        portName: "js-artnet-package",
        longName: "js-artnet-package jep!",
        nodeReport: "#0001 [0001] zzzzz...This node Feels very gooood!!!",
        numPorts: 0x0001,
        portTypes1: {
            canOutput: "yes",
            canInput: "no",
            protocol: "artnet",
        },
        portTypes2: {
            canOutput: "yes",
            canInput: "no",
            protocol: "artnet",
        },
        portTypes3: {
            canOutput: "yes",
            canInput: "no",
            protocol: "artnet",
        },
        portTypes4: {
            canOutput: "yes",
            canInput: "no",
            protocol: "artnet",
        },
        goodInput1: {
            dataReceived: "no", 
            dmxTestPackets: "no",
            dmxSip: "no",
            dmxTextPacket: "no",
            isDisabled: "yes",
            errorReceived: "no",
            convertTo: "artnet", 
        },
        goodInput2: {
            dataReceived: "no", 
            dmxTestPackets: "no",
            dmxSip: "no",
            dmxTextPacket: "no",
            isDisabled: "yes",
            errorReceived: "no",
            convertTo: "artnet", 
        },
        goodInput3: {
            dataReceived: "no", 
            dmxTestPackets: "no",
            dmxSip: "no",
            dmxTextPacket: "no",
            isDisabled: "yes",
            errorReceived: "no",
            convertTo: "artnet", 
        },
        goodInput4: {
            dataReceived: "no", 
            dmxTestPackets: "no",
            dmxSip: "no",
            dmxTextPacket: "no",
            isDisabled: "yes",
            errorReceived: "no",
            convertTo: "artnet", 
        },
        goodOutputA1: {
            dataTransmitted: "no", 
            dmxTestPackets: "no",
            dmxSip: "no", 
            dmxTextPacket: "no",
            isMerging: "yes", 
            portFault: "no", 
            mergeMode: "htp", 
            convertFrom: "artnet", 
        },
        goodOutputA2: {
            dataTransmitted: "no", 
            dmxTestPackets: "no",
            dmxSip: "no", 
            dmxTextPacket: "no",
            isMerging: "yes", 
            portFault: "no", 
            mergeMode: "htp", 
            convertFrom: "artnet", 
        },
        goodOutputA3: {
            dataTransmitted: "no", 
            dmxTestPackets: "no",
            dmxSip: "no", 
            dmxTextPacket: "no",
            isMerging: "yes", 
            portFault: "no", 
            mergeMode: "htp", 
            convertFrom: "artnet", 
        },
        goodOutputA4: {
            dataTransmitted: "no", 
            dmxTestPackets: "no",
            dmxSip: "no", 
            dmxTextPacket: "no",
            isMerging: "yes", 
            portFault: "no", 
            mergeMode: "htp", 
            convertFrom: "artnet", 
        },
        swIn1: 0,
        swIn2: 0,
        swIn3: 0,
        swIn4: 0,
        swOut1: 0,
        swOut2: 0,
        swOut3: 0,
        swOut4: 0,
        acnPriority: 0,
        swMacro: ({
            macro1: "off", 
            macro2: "off", 
            macro3: "off", 
            macro4: "off", 
            macro5: "off", 
            macro6: "off", 
            macro7: "off", 
            macro8: "off", 
        }),
        swRemote: ({
            remote1: "off", 
            remote2: "off", 
            remote3: "off", 
            remote4: "off", 
            remote5: "off", 
            remote6: "off", 
            remote7: "off", 
            remote8: "off", 
        }),        
        style: "stController",
        macAddress: [0xe6, 0x00, 0x8e, 0xe6, 0xd3, 0x74],
        bindIp: [192, 168, 2, 114],
        bindIndex: 1,
        status2: {
            rdmArtAddr: "no",
            outputStyleArtAddr: "yes", 
            squawking: "yes", 
            artAndAcn: "yes", 
            portAddrs: "bit15", 
            canDhcp: "yes", 
            configureIp: "dhcp", 
            webFig: "no", 
        },
        goodOutputB1: {
            rdm: "on",
            outputStyle: "continuos",
            discovery: "on",
            backgroundDiscovery: "on",
        },
        goodOutputB2: {
            rdm: "on",
            outputStyle: "continuos",
            discovery: "on",
            backgroundDiscovery: "on",
        },
        goodOutputB3: {
            rdm: "on",
            outputStyle: "continuos",
            discovery: "on",
            backgroundDiscovery: "on",
        },
        goodOutputB4: {
            rdm: "on",
            outputStyle: "continuos",
            discovery: "on",
            backgroundDiscovery: "on",
        },
        status3: {
            failsafeState: "hold", 
            failsafeProgramable: "yes", 
            supportLlrp: "no", 
            portDirectionSwitch: "no",
            canRdmNet: "no",
            canBackgroundQueue: "no",
            canDisableBckQueue: "no",
        },
        defaultRespUid: [0, 0, 0, 0, 0, 0],
        userData: [0, 0],
        refreshRate: 0x002c,
        bckQueuePolicy: "statusNone",
}

class PollReplyPacket extends ArtNetPackets{
    constructor(){
        super(pollReplySchema, 207)
        this.counters.nodeReport = {
            rollOver: 9999,
            value: 0
        },
        this.data = structuredClone(pollReplyData)
        this.nodeReportCode = "RcPowerOk"
    }

    encode (){
        //console.log("encoding")
        this._increntCounters();
        this._updateNodeReport()
        return this.schema.toBuffer(this.data)
    }

    // #xxxx [yyyy] zzzzz... This node Feels very gooood!!!” 
    // xxxx is a hex status code as defined in Table 3. 
    // yyyy is a decimal counter that increments every 
    //      time the Node sends an ArtPollResponse and 
    //      rolls over at 999
    _updateNodeReport(){
        //console.log("reportCounter : " + this.counters.nodeReport.value)

        let reportCode = (ArtNetCodes.getReportCode(this.nodeReportCode) ?? 0).toString().padStart(4, "0")
        let reportCounter = this.counters.nodeReport.value.toString().padStart(4, "0")

        this.data.nodeReport = this.data.nodeReport.replace(/\[....\]/, `[${reportCounter}]`)
                                                   .replace(/#..../, `#${reportCode}`)

        //console.log("Node Report : " + this.data.nodeReport)
    }

}

module.exports = {
    PollReplyPacket
}