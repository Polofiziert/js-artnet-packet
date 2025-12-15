/**
 * Art-Net Operation Codes
 * 
 * Complete list of all Art-Net protocol operation codes with descriptions.
 * Each OpCode identifies the type of Art-Net packet being transmitted.
 * 
 * @typedef {Object} OpCodeDefinition
 * @property {string} name - The operation code name (e.g., 'OpPoll')
 * @property {number} code - The hexadecimal operation code value
 * @property {string} definition - Human-readable description of the packet type
 * 
 * @type {OpCodeDefinition[]}
 * 
 * @example
 * // Find an OpCode
 * const poll = AT_OPCODES.find(op => op.name === 'OpPoll');
 * console.log(poll.code); // 0x2000
 * 
 * @example
 * // Get OpCode by code value
 * const dmx = AT_OPCODES.find(op => op.code === 0x5000);
 * console.log(dmx.name); // 'OpDmx'
 */
const AT_OPCODES = [
    // Device Discovery
    /**
     * OpPoll - Node discovery request
     * Controller sends this to discover all nodes on the network
     */
    {
        name: 'OpPoll',
        code: 0x2000,
        definition: 'This is an ArtPoll packet, no other data is contained in this UDP packet.',
    },
    /**
     * OpPollReply - Node discovery response
     * Node responds with its status and configuration information
     */
    {
        name: 'OpPollReply',
        code: 0x2100 ,
        definition: 'This is an ArtPollReply Packet. It contains device status information.',
    },
    /**
     * OpDiagData - Diagnostics and logging
     * Used for sending diagnostic data and logging information
     */
    {
        name: 'OpDiagData',
        code: 0x2300 ,
        definition: 'Diagnostics and data logging packet.',
    },
    /**
     * OpCommand - Text-based commands
     * Used to send parameter commands to nodes
     */
    {
        name: 'OpCommand',
        code: 0x2400 ,
        definition: 'This is an ArtCommand packet. It is used to send text based parameter commands.',
    },
    /**
     * OpDataRequest - Request data from node
     * Request product URLs and other data from nodes
     */
    {
        name: 'OpDataRequest',
        code: 0x2700 ,
        definition: 'This is an ArtDataRequest packet. It is used to request data such as products URLs',
    },
    /**
     * OpDataReply - Send requested data
     * Reply to OpDataRequest packets with requested information
     */
    {
        name: 'OpDataReply',
        code: 0x2800 ,
        definition: 'This is an ArtDataReply packet. It is used to reply to ArtDataRequest packets.',
    },
    /**
     * OpDmx - DMX512 data transmission
     * Main packet type for sending DMX512 control data (512 channels per universe)
     */
    {
        name: 'OpDmx',
        code: 0x5000,
        definition: 'OpDMX / OpOutput: This is an ArtDmx data packet. It contains zero start code DMX512 information for a single Universe.',
    },
    /**
     * OpNzs - Non-zero start code DMX
     * DMX512 data with non-zero start codes (except RDM)
     */
    {
        name: 'OpNzs',
        code: 0x5100 ,
        definition: 'This is an ArtNzs data packet. It contains non-zero start code (except RDM) DMX512 information for a single Universe.', 
    },
    /**
     * OpSync - Synchronization signal
     * Forces synchronous output of multiple ArtDmx packets
     */
    {
        name: 'OpSync',
        code: 0x5200 ,
        definition: 'This is an ArtSync data packet. It is used to force synchronous transfer of ArtDmx packets to a nodes output.',
    },
    /**
     * OpAddress - Node configuration
     * Remote programming of node parameters (port address, merge mode, etc.)
     */
    {
        name: 'OpAddress',
        code: 0x6000 ,
        definition: 'This is an ArtAddress packet. It contains remote programming information for a Node.',
    },
    /**
     * OpInput - Input control
     * Enable/disable DMX input ports on nodes
     */
    {
        name: 'OpInput',
        code: 0x7000 ,
        definition: 'This is an ArtInput packet. It contains enable - disable data for DMX inputs.',
    },
    /**
     * OpTodRequest - RDM Table of Devices request
     * Request a Table of Devices for RDM discovery
     */
    {
        name: 'OpTodRequest',
        code: 0x8000 ,
        definition: 'This is an ArtTodRequest packet. It is used to request a Table of Devices (ToD) for RDM discovery.',
    },
    /**
     * OpTodData - RDM Table of Devices data
     * Send Table of Devices information for RDM discovery
     */
    {
        name: 'OpTodData',
        code: 0x8100 ,
        definition: 'This is an ArtTodData packet. It is used to send a Table of Devices (ToD) for RDM discovery.',
    },
    /**
     * OpTodControl - RDM discovery control
     * Send RDM discovery control commands
     */
    {
        name: 'OpTodControl',
        code: 0x8200 ,
        definition: 'This is an ArtTodControl packet. It is used to send RDM discovery control messages.',
    },
    /**
     * OpRdm - RDM messaging (non-discovery)
     * Send RDM command/response messages (Get, Set, GetResponse, SetResponse)
     */
    {
        name: 'OpRdm',
        code: 0x8300,
        definition: 'This is an ArtRdm packet. It is used to send all non discovery RDM messages.',
    },
    /**
     * OpRdmSub - RDM sub-device messaging
     * Compressed RDM Sub-Device data transmission
     */
    {
        name: 'OpRdmSub',
        code: 0x8400 ,
        definition: 'This is an ArtRdmSub packet. It is used to send compressed, RDM Sub-Device data.',
    },
    /**
     * OpVideoSetup - Video setup configuration
     * @deprecated
     * Used for extended video features (deprecated in modern versions)
     */
    {
        name: 'OpVideoSetup',
        code: 0xa010 ,
        definition: 'This is an ArtVideoSetup packet. It contains video screen setup information for nodes that implement the extended video features.',
    },
    /**
     * OpVideoPalette - Video palette setup
     * @deprecated
     * Video color palette configuration (deprecated)
     */
    {
        name: 'OpVideoPalette',
        code: 0xa020,
        definition: 'This is an ArtVideoPalette packet. It contains colour palette setup information for nodes that implement the extended video features.',
    },
    /**
     * OpVideoData - Video display data
     * @deprecated
     * Video frame data transmission (deprecated)
     */
    {
        name: 'OpVideoData',
        code: 0xa040 ,
        definition: 'This is an ArtVideoData packet. It contains display data for nodes that implement the extended video features.',
    },
    /**
     * OpMacMaster - Mac address programming
     * @deprecated
     * This packet is no longer used in current Art-Net implementations
     */
    {
        name: 'OpMacMaster',
        code: 0xf000,
        definition: 'This packet is deprecated.',
    },
    /**
     * OpMacSlave - Mac address slave
     * @deprecated
     * This packet is no longer used in current Art-Net implementations
     */
    {
        name: 'OpMacSlave',
        code: 0xf100 ,
        definition: 'This packet is deprecated.',
    },
    /**
     * OpFirmwareMaster - Firmware upload
     * Upload new firmware or firmware extensions to nodes
     */
    {
        name: 'OpFirmwareMaster',
        code: 0xf200,
        definition: 'This is an ArtFirmwareMaster packet. It is used to upload new firmware or firmware extensions to the Node.',
    },
    /**
     * OpFirmwareReply - Firmware upload acknowledgment
     * Node acknowledges receipt of firmware packet
     */
    {
        name: 'OpFirmwareReply',
        code: 0xf300 ,
        definition: 'This is an ArtFirmwareReply packet. It is returned by the node to acknowledge receipt of an ArtFirmwareMaster packet or ArtFileTnMaster packet.',
    },
    /**
     * OpFileTnMaster - File transfer upload
     * Upload user files to nodes
     */
    {
        name: 'OpFileTnMaster',
        code: 0xf400 ,
        definition: 'Uploads user file to node.',
    },
    /**
     * OpFileFnMaster - File transfer download
     * Download user files from nodes
     */
    {
        name: 'OpFileFnMaster',
        code: 0xf500 ,
        definition: 'Downloads user file from node.',
    },
    /**
     * OpFileFnReply - File download acknowledgment
     * Server to node acknowledge for file download packets
     */
    {
        name: 'OpFileFnReply',
        code: 0xf600 ,
        definition: 'Server to Node acknowledge for download packets.',
    },
    /**
     * OpIpProg - IP configuration
     * Re-programme node's IP address and network mask
     */
    {
        name: 'OpIpProg',
        code: 0xf800  ,
        definition: 'This is an ArtIpProg packet. It is used to re-programme the IP address and Mask of the Node.',
    },
    /**
     * OpIpProgReply - IP configuration acknowledgment
     * Node acknowledges IP programming packet
     */
    {
        name: 'OpIpProgReply',
        code: 0xf900  ,
        definition: 'This is an ArtIpProgReply packet. It is returned by the node to acknowledge receipt of an ArtIpProg packet.',
    },
    /**
     * OpMedia - Media server packet
     * Unicast by media servers to controllers
     */
    {
        name: 'OpMedia',
        code: 0x9000,
        definition: 'This is an ArtMedia packet. It is Unicast by a Media Server and acted upon by a Controller.',
    },
    /**
     * OpMediaPatch - Media patch configuration
     * Controller to media server patch configuration
     */
    {
        name: 'OpMediaPatch',
        code: 0x9100,
        definition: 'This is an ArtMediaPatch packet. It is Unicast by a Controller and acted upon by a Media Server.',
    },
    /**
     * OpMediaControl - Media control commands
     * Controller to media server control commands
     */
    {
        name: 'OpMediaControl',
        code: 0x9200,
        definition: 'This is an ArtMediaControl packet. It is Unicast by a Controller and acted upon by a Media Server.',
    },
    /**
     * OpMediaContrlReply - Media control response
     * Media server response to control commands
     */
    {
        name: 'OpMediaContrlReply',
        code: 0x9300,
        definition: 'This is an ArtMediaControlReply packet. It is Unicast by a Media Server and acted upon by a Controller.',
    },
    /**
     * OpTimeCode - SMPTE timecode
     * Transport SMPTE/MTC timecode over the network for synchronization
     */
    {
        name: 'OpTimeCode',
        code: 0x9700,
        definition: 'This is an ArtTimeCode packet. It is used to transport time code over the network.',
    },
    /**
     * OpTimeSync - Time synchronization
     * Synchronize real time date and clock across network
     */
    {
        name: 'OpTimeSync',
        code: 0x9800,
        definition: 'Used to synchronise real time date and clock',
    },
    /**
     * OpTrigger - Trigger macros
     * Send trigger commands for macros and scenes
     */
    {
        name: 'OpTrigger',
        code: 0x9900 ,
        definition: 'Used to send trigger macros',
    },
    /**
     * OpDirectory - File directory request
     * Request a node's file list
     */
    {
        name: 'OpDirectory',
        code: 0x9a00 ,
        definition: 'Requests a nodes file list',
    },
    /**
     * OpDirectoryReply - File directory response
     * Reply to OpDirectory with file list information
     */
    {
        name: 'OpDirectoryReply',
        code: 0x9b00 ,
        definition: 'Replies to OpDirectory with file list',
    },    
]

/**
 * Module exports
 * 
 * @exports opcodes
 * @property {OpCodeDefinition[]} AT_OPCODES - Array of all Art-Net operation code definitions
 */
module.exports = {
    AT_OPCODES
}