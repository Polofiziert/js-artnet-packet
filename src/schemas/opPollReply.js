// import * as r from 'restructure';
const r = require('restructure');
const {MappedBitfield, FixedString, MappedEnum} = require('./fieldTypeExtention')

const status1Field = {
    indicator:  { bits: [6, 2], map: { unknown: 0, locate: 1, mute: 2, normal: 3 } },
    auth:       { bits: [4, 2], map: { unknown: 0, front_panel: 1, network: 2 } },
    bootMode:   { bits: [2, 1], map: { normal: 0, other: 1 } },
    isRdm:      { bits: [1, 1], map: { no: 0, yes: 1 } },
    hasUbea:    { bits: [0, 1], map: { no: 0, yes: 1 } },
}

const portTypesField = {
        canOutput: {
            bits: [7, 1], 
            map: { no: 0, yes: 1 } 
        },
        canInput: {
            bits: [6, 1], 
            map: { no: 0, yes: 1 } 
        },
        protocol: {
            bits: [0, 5], 
            map: { dmx512: 0, midi: 1, avab: 2, colortranCMX: 3, adb625: 4, artnet: 5, dali: 6} 
        },
    }

const goodInputField = {
        dataReceived:   { bits: [7, 1], map: { no: 0, yes: 1 } }, 
        dmxTestPackets: { bits: [6, 1], map: { no: 0, yes: 1 } },
        dmxSip:         { bits: [5, 1], map: { no: 0, yes: 1 } }, 
        dmxTextPacket:  { bits: [4, 1], map: { no: 0, yes: 1 } },
        isDisabled:     { bits: [3, 1], map: { no: 0, yes: 1 } }, 
        errorReceived:  { bits: [2, 1], map: { no: 0, yes: 1 } }, 
        // bit 1 / 2.bit not set bit unused
        convertTo:      { bits: [0, 1], map: { artnet: 0, acn: 1 } }, 
    }
    
const goodOutputAField = {
        dataTransmitted:    { bits: [7, 1], map: { no: 0, yes: 1 } }, 
        dmxTestPackets:     { bits: [6, 1], map: { no: 0, yes: 1 } },
        dmxSip:             { bits: [5, 1], map: { no: 0, yes: 1 } }, 
        dmxTextPacket:      { bits: [4, 1], map: { no: 0, yes: 1 } },
        isMerging:          { bits: [3, 1], map: { no: 0, yes: 1 } }, 
        portFault:          { bits: [2, 1], map: { no: 0, yes: 1 } }, 
        mergeMode:          { bits: [1, 1], map: { htp: 0, ltp: 1 } }, 
        convertFrom:        { bits: [0, 1], map: { artnet: 0, acn: 1 } }, 
    }

const status2Field = {
        rdmArtAddr:             { bits: [7, 1], map: { no: 0, yes: 1 } }, 
        outputStyleArtAddr:     { bits: [6, 1], map: { no: 0, yes: 1 } }, 
        squawking:              { bits: [5, 1], map: { no: 0, yes: 1 } }, 
        artAndAcn:              { bits: [4, 1], map: { no: 0, yes: 1 } }, 
        portAddrs:              { bits: [3, 1], map: { bit8: 0, bit15: 1 } }, 
        canDhcp:                { bits: [2, 1], map: { no: 0, yes: 1 } }, 
        configureIp:            { bits: [1, 1], map: { manual: 0, dhcp: 1 } }, 
        webFig:                 { bits: [0, 1], map: { no: 0, yes: 1 } }, 
    }

const goodOutputBField = {
        rdm:                    { bits: [7, 1], map: { on: 0, off: 1 } }, 
        outputStyle:            { bits: [6, 1], map: { delta: 0, continuos: 1 } }, 
        discovery:              { bits: [5, 1], map: { off: 0, on: 1 } }, 
        backgroundDiscovery:    { bits: [4, 1], map: { on: 0, off: 1 } }, 
    }

const status3Field = {
        failsafeState:          { bits: [6, 2], map: { hold: 0, zero: 1, full: 2, scene: 3} }, 
        failsafeProgramable:    { bits: [5, 1], map: { no: 0, yes: 1 } }, 
        supportLlrp:            { bits: [4, 1], map: { no: 0, yes: 1 } }, 
        portDirectionSwitch:    { bits: [3, 1], map: { no: 0, yes: 1 } },
        canRdmNet:              { bits: [2, 1], map: { no: 0, yes: 1 } },
        canBackgroundQueue:     { bits: [1, 1], map: { no: 0, yes: 1 } },
        canDisableBckQueue:     { bits: [0, 1], map: { no: 0, yes: 1 } },
    }

const pollReplySchema = new r.Struct({
    id: FixedString(8),
    opCode: r.uint16le,
    // Packet Begins
    ipAddress: new r.Array(r.uint8, 4),
    port: r.uint16le,
    versionInfo: new r.Array(r.uint8, 2),
    netSwitch: r.uint8,
    subSwitch: r.uint8,
    oem: new r.Array(r.uint8, 2),
    ubeaVersion: r.uint8,
    status1: MappedBitfield(status1Field),
    estaMan: new r.Array(r.uint8, 2),
    portName: FixedString(18),
    longName: FixedString(64),
    nodeReport: FixedString(64),
    numPorts: r.uint16be,
    portTypes1: MappedBitfield(portTypesField),
    portTypes2: MappedBitfield(portTypesField),
    portTypes3: MappedBitfield(portTypesField),
    portTypes4: MappedBitfield(portTypesField),
    goodInput1: MappedBitfield(goodInputField),
    goodInput2: MappedBitfield(goodInputField),
    goodInput3: MappedBitfield(goodInputField),
    goodInput4: MappedBitfield(goodInputField),
    goodOutputA1: MappedBitfield(goodOutputAField),
    goodOutputA2: MappedBitfield(goodOutputAField),
    goodOutputA3: MappedBitfield(goodOutputAField),
    goodOutputA4: MappedBitfield(goodOutputAField),
    swIn1: r.uint8,
    swIn2: r.uint8,
    swIn3: r.uint8,
    swIn4: r.uint8,
    swOut1: r.uint8,
    swOut2: r.uint8,
    swOut3: r.uint8,
    swOut4: r.uint8,
    acnPriority: r.uint8,
    swMacro: MappedBitfield({
        macro1: { bits: [0, 1], map: { on: 1, off: 0 } }, 
        macro2: { bits: [1, 1], map: { on: 1, off: 0 } }, 
        macro3: { bits: [2, 1], map: { on: 1, off: 0 } }, 
        macro4: { bits: [3, 1], map: { on: 1, off: 0 } }, 
        macro5: { bits: [4, 1], map: { on: 1, off: 0 } }, 
        macro6: { bits: [5, 1], map: { on: 1, off: 0 } }, 
        macro7: { bits: [6, 1], map: { on: 1, off: 0 } }, 
        macro8: { bits: [7, 1], map: { on: 1, off: 0 } }, 
    }),
    swRemote: MappedBitfield({
        remote1: { bits: [0, 1], map: { on: 1, off: 0 } }, 
        remote2: { bits: [1, 1], map: { on: 1, off: 0 } }, 
        remote3: { bits: [2, 1], map: { on: 1, off: 0 } }, 
        remote4: { bits: [3, 1], map: { on: 1, off: 0 } }, 
        remote5: { bits: [4, 1], map: { on: 1, off: 0 } }, 
        remote6: { bits: [5, 1], map: { on: 1, off: 0 } }, 
        remote7: { bits: [6, 1], map: { on: 1, off: 0 } }, 
        remote8: { bits: [7, 1], map: { on: 1, off: 0 } }, 
    }),
    spare: new r.Reserved(r.uint8, 3),
    style: MappedEnum({
        stNode: 0x00,
        stController: 0x01,
        stMedia: 0x02,
        stRoute: 0x03,
        stBackup: 0x04,
        stConfig: 0x05,
        stVisual: 0x06
    }),
    macAddress: new r.Array(r.uint8, 6),
    // Min packet lenght for valid artPollReply Packet, following fields are Art-Net4 Specific
    bindIp: new r.Array(r.uint8, 4),
    bindIndex: r.uint8,
    status2: MappedBitfield(status2Field),
    goodOutputB1: MappedBitfield(goodOutputBField),
    goodOutputB2: MappedBitfield(goodOutputBField),
    goodOutputB3: MappedBitfield(goodOutputBField),
    goodOutputB4: MappedBitfield(goodOutputBField),
    status3: MappedBitfield(status3Field),
    defaultRespUid: new r.Array(r.uint8, 6),
    userData: new r.Array(r.uint8, 2),
    refreshRate: r.uint16be,
    bckQueuePolicy: MappedEnum({
        statusNone: 0x00,
        statusAdvisory: 0x01,
        statusWarning: 0x02,
        statusError: 0x03,
        disabled: 0x04,
        manufacturer1: 0x05,
        manufacturer2: 0x06,
        manufacturer3: 0x07,
        manufacturer4: 0x08,
        manufacturer5: 0x09,
        manufacturer6: 0x0a,
        manufacturer7: 0x0b,
    }),
    reserved: new r.Reserved(r.uint8, 12),
});

module.exports = {
    pollReplySchema
}