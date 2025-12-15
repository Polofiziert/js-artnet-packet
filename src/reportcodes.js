AT_REPORT_CODES = new Array

AT_REPORT_CODES = [
    {
        name: 'RcDebug',
        code: 0x0000,
        description: 'Booted in debug mode (Only used in development)'
    },
    {
        name: 'RcPowerOk',
        code: 0x0001,
        description: 'Power On Tests successful'
    },
    {
        name: 'RcPowerFail',
        code: 0x0003,
        description: 'Hardware tests failed at Power On'
    },
    {
        name: 'RcSocketWr1',
        code: 0x0003,
        description: 'Last UDP from Node failed due to truncated length, Most likely caused by a collision.'
    },
    {
        name: 'RcParseFail',
        code: 0x0004,
        description: 'Unable to identify last UDP transmission. Check OpCode and packet length.'
    },
    {
        name: 'RcUdpFail',
        code: 0x0005,
        description: 'Unable to open Udp Socket in last transmission attempt'
    },
    {
        name: 'RcShNameOk',
        code: 0x0006,
        description: 'Confirms that Port Name programming via ArtAddress, was successful.'
    },
    {
        name: 'RcLoNameOk',
        code: 0x0007,
        description: 'Confirms that Long Name programming via ArtAddress, was successful.'
    },
    {
        name: 'RcDmxError',
        code: 0x0008,
        description: 'DMX512 receive errors detected.'
    },
    {
        name: 'RcDmxUdpFull',
        code: 0x0009,
        description: 'Ran out of internal DMX transmit buffers.'
    },
    {
        name: 'RcDmxRxFull',
        code: 0x000a,
        description: 'Ran out of internal DMX Rx buffers.'
    },
    {
        name: 'RcSwitchErr',
        code: 0x000b,
        description: 'Rx Universe switches conflict.'
    },
    {
        name: 'RcConfigErr',
        code: 0x000c,
        description: 'Product configuration does not match firmware.'
    },
    {
        name: 'RcDmxShort',
        code: 0x000d,
        description: 'DMX output short detected. See GoodOutput field.'
    },
    {
        name: 'RcFirmwareFail',
        code: 0x000e,
        description: 'Last attempt to upload new firmware failed.'
    },
    {
        name: 'RcUserFail',
        code: 0x000f,
        description: 'User changed switch settings when address locked by remote programming. User changes ignored.'
    },
    {
        name: 'RcFactoryRes',
        code: 0x000f,
        description: 'Factory reset has occurred.'
    },
    {
        name: 'RcLoNameOk',
        code: 0x000f,
        description: ''
    },
]