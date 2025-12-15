AT_OPCODES = new Array

AT_OPCODES = [
    {
        name: 'OpPoll',
        value: 0x2000,
        definition: 'This is an ArtPoll packet, no other data is contained in this UDP packet.',
    },
    {
        name: 'OpPollReply',
        value: 0x2100 ,
        definition: 'This is an ArtPollReply Packet. It contains device status information.',
    },
    {
        name: 'OpDiagData',
        value: 0x2300 ,
        definition: 'Diagnostics and data logging packet.',
    },
    {
        name: 'OpCommand',
        value: 0x2400 ,
        definition: 'This is an ArtCommand packet. It is used to send text based parameter commands.',
    },
    {
        name: 'OpDataRequest',
        value: 0x2700 ,
        definition: 'This is an ArtDataRequest packet. It is used to request data such as products URLs',
    },
    {
        name: 'OpDataReply',
        value: 0x2800 ,
        definition: 'This is an ArtDataReply packet. It is used to reply to ArtDataRequest packets.',
    },
    {
        name: 'OpDmx',
        value: 0x5000,
        definition: 'OpDMX / OpOutput: This is an ArtDmx data packet. It contains zero start code DMX512 information for a single Universe.',
    },
    {
        name: 'OpNzs',
        value: 0x5100 ,
        definition: 'This is an ArtNzs data packet. It contains non-zero start code (except RDM) DMX512 information for a single Universe.', 
    },
    {
        name: 'OpSync',
        value: 0x5200 ,
        definition: 'This is an ArtSync data packet. It is used to force synchronous transfer of ArtDmx packets to a nodes output.',
    },
    {
        name: 'OpAddress',
        value: 0x6000 ,
        definition: 'This is an ArtAddress packet. It contains remote programming information for a Node.',
    },
    {
        name: 'OpInput',
        value: 0x7000 ,
        definition: 'This is an ArtInput packet. It contains enable - disable data for DMX inputs.',
    },
    {
        name: 'OpTodRequest',
        value: 0x8000 ,
        definition: 'This is an ArtTodRequest packet. It is used to request a Table of Devices (ToD) for RDM discovery.',
    },
    {
        name: 'OpTodData',
        value: 0x8100 ,
        definition: 'This is an ArtTodData packet. It is used to send a Table of Devices (ToD) for RDM discovery.',
    },
    {
        name: 'OpTodControl',
        value: 0x8200 ,
        definition: 'This is an ArtTodControl packet. It is used to send RDM discovery control messages.',
    },
    {
        name: 'OpRdm',
        value: 0x8300,
        definition: 'This is an ArtRdm packet. It is used to send all non discovery RDM messages.',
    },
    {
        name: 'OpRdmSub',
        value: 0x8400 ,
        definition: 'This is an ArtRdmSub packet. It is used to send compressed, RDM Sub-Device data.',
    },
    {
        name: 'OpVideoSetup',
        value: 0xa010 ,
        definition: 'This is an ArtVideoSetup packet. It contains video screen setup information for nodes that implement the extended video features.',
    },
    {
        name: 'OpVideoPalette',
        value: 0xa020,
        definition: 'This is an ArtVideoPalette packet. It contains colour palette setup information for nodes that implement the extended video features.',
    },
    {
        name: 'OpVideoData',
        value: 0xa040 ,
        definition: 'This is an ArtVideoData packet. It contains display data for nodes that implement the extended video features.',
    },
    {
        name: 'OpMacMaster',
        value: 0xf000,
        definition: 'This packet is deprecated.',
    },
    {
        name: 'OpMacSlave',
        value: 0xf100 ,
        definition: 'This packet is deprecated.',
    },
    {
        name: 'OpFirmwareMaster',
        value: 0xf200,
        definition: 'This is an ArtFirmwareMaster packet. It is used to upload new firmware or firmware extensions to the Node.',
    },
    {
        name: 'OpFirmwareReply',
        value: 0xf300 ,
        definition: 'This is an ArtFirmwareReply packet. It is returned by the node to acknowledge receipt of an ArtFirmwareMaster packet or ArtFileTnMaster packet.',
    },
    {
        name: 'OpFileTnMaster',
        value: 0xf400 ,
        definition: 'Uploads user file to node.',
    },
    {
        name: 'OpFileFnMaster',
        value: 0xf500 ,
        definition: 'Downloads user file from node.',
    },
    {
        name: 'OpFileFnReply',
        value: 0xf600 ,
        definition: 'Server to Node acknowledge for download packets.',
    },
    {
        name: 'OpIpProg',
        value: 0xf800  ,
        definition: 'This is an ArtIpProg packet. It is used to re-programme the IP address and Mask of the Node.',
    },
    {
        name: 'OpIpProgReply',
        value: 0xf900  ,
        definition: 'This is an ArtIpProgReply packet. It is returned by the node to acknowledge receipt of an ArtIpProg packet.',
    },
    {
        name: 'OpMedia',
        value: 0x9000,
        definition: 'This is an ArtMedia packet. It is Unicast by a Media Server and acted upon by a Controller.',
    },
    {
        name: 'OpMediaPatch',
        value: 0x9100,
        definition: 'This is an ArtMediaPatch packet. It is Unicast by a Controller and acted upon by a Media Server.',
    },
    {
        name: 'OpMediaControl',
        value: 0x9200,
        definition: 'This is an ArtMediaControl packet. It is Unicast by a Controller and acted upon by a Media Server.',
    },
    {
        name: 'OpMediaContrlReply',
        value: 0x9300,
        definition: 'This is an ArtMediaControlReply packet. It is Unicast by a Media Server and acted upon by a Controller.',
    },
    {
        name: 'OpTimeCode',
        value: 0x9700,
        definition: 'This is an ArtTimeCode packet. It is used to transport time code over the network.',
    },
    {
        name: 'OpTimeSync',
        value: 0x9800,
        definition: 'Used to synchronise real time date and clock',
    },
    {
        name: 'OpTrigger',
        value: 0x9900 ,
        definition: 'Used to send trigger macros',
    },
    {
        name: 'OpDirectory',
        value: 0x9a00 ,
        definition: 'Requests a nodes file list',
    },
    {
        name: 'OpDirectoryReply',
        value: 0x9b00 ,
        definition: 'Replies to OpDirectory with file list',
    },    
]