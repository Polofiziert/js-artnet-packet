/**
 * Art-Net Report Codes
 * These codes are reported by Art-Net nodes in ArtPollReply packets to indicate
 * their current status and any operational issues or events that have occurred.
 * Report codes help controllers understand node health and configuration state.
 *
 * @typedef {Object} ReportCodeDefinition
 * @property {string} name - The report code identifier (e.g., 'RcPowerOk')
 * @property {number} code - The hex code value (e.g., 0x0001)
 * @property {string} definition - Human-readable definition of what the code means
 *
 * @type {ReportCodeDefinition[]}
 * 
 * @typedef {function} getCodeName
 * 
 *
 * @example
 * // Find a specific report code
 * const powerOk = AT_REPORT_CODES.find(rc => rc.name === 'RcPowerOk');
 * console.log(powerOk.definition); // 'Power On Tests successful'
 *
 * @example
 * // Map all report codes to a lookup object
 * const reportCodeMap = {};
 * AT_REPORT_CODES.forEach(rc => {
 *   reportCodeMap[rc.code] = rc.name;
 * });
 */

const AT_REPORT_CODES = [
    /**
     * Debug mode indicator
     * Node is running in development/debug mode only
     */
    {
        name: 'RcDebug',
        code: 0x0000,
        definition: 'Booted in debug mode (Only used in development)'
    },
    /**
     * Power-on tests passed
     * Hardware has successfully completed all power-on self-tests
     */
    {
        name: 'RcPowerOk',
        code: 0x0001,
        definition: 'Power On Tests successful'
    },
    /**
     * Power-on tests failed
     * Node failed hardware diagnostic tests during startup
     */
    {
        name: 'RcPowerFail',
        code: 0x0003,
        definition: 'Hardware tests failed at Power On'
    },
    /**
     * UDP write error - packet truncation
     * Last UDP transmission failed due to truncated packet length,
     * likely caused by a network collision
     */
    {
        name: 'RcSocketWr1',
        code: 0x0003,
        definition: 'Last UDP from Node failed due to truncated length, Most likely caused by a collision.'
    },
    /**
     * Packet parsing failure
     * Node unable to parse last UDP transmission.
     * Possible causes: invalid OpCode or incorrect packet length
     */
    {
        name: 'RcParseFail',
        code: 0x0004,
        definition: 'Unable to identify last UDP transmission. Check OpCode and packet length.'
    },
    /**
     * UDP socket failure
     * Node was unable to open a UDP socket for transmission
     */
    {
        name: 'RcUdpFail',
        code: 0x0005,
        definition: 'Unable to open Udp Socket in last transmission attempt'
    },
    /**
     * Short name programming successful
     * Port short name (6 characters) was successfully programmed via ArtAddress
     */
    {
        name: 'RcShNameOk',
        code: 0x0006,
        definition: 'Confirms that Port Name programming via ArtAddress, was successful.'
    },
    /**
     * Long name programming successful
     * Port long name (32 characters) was successfully programmed via ArtAddress
     */
    {
        name: 'RcLoNameOk',
        code: 0x0007,
        definition: 'Confirms that Long Name programming via ArtAddress, was successful.'
    },
    /**
     * DMX512 receive error
     * Node detected errors while receiving DMX512 data on one or more ports
     */
    {
        name: 'RcDmxError',
        code: 0x0008,
        definition: 'DMX512 receive errors detected.'
    },
    /**
     * DMX UDP buffer overflow
     * Node exhausted internal DMX UDP transmit buffers.
     * May indicate network congestion or insufficient buffer allocation
     */
    {
        name: 'RcDmxUdpFull',
        code: 0x0009,
        definition: 'Ran out of internal DMX transmit buffers.'
    },
    /**
     * DMX receive buffer overflow
     * Node exhausted internal DMX receive buffers.
     * May indicate DMX input overload or insufficient buffer allocation
     */
    {
        name: 'RcDmxRxFull',
        code: 0x000a,
        definition: 'Ran out of internal DMX Rx buffers.'
    },
    /**
     * Universe switch conflict
     * Receive universe switch settings conflict between network and physical switches
     */
    {
        name: 'RcSwitchErr',
        code: 0x000b,
        definition: 'Rx Universe switches conflict.'
    },
    /**
     * Configuration mismatch
     * Product hardware configuration doesn't match loaded firmware.
     * May require firmware reload or hardware reconfiguration
     */
    {
        name: 'RcConfigErr',
        code: 0x000c,
        definition: 'Product configuration does not match firmware.'
    },
    /**
     * DMX output short circuit
     * Node detected a short circuit on DMX output.
     * Check GoodOutput field in ArtPollReply for affected ports
     */
    {
        name: 'RcDmxShort',
        code: 0x000d,
        definition: 'DMX output short detected. See GoodOutput field.'
    },
    /**
     * Firmware upload failure
     * Node failed to load new firmware.
     * Previous firmware may still be active; retry upload or check file integrity
     */
    {
        name: 'RcFirmwareFail',
        code: 0x000e,
        definition: 'Last attempt to upload new firmware failed.'
    },
    /**
     * User switch change rejected
     * User attempted to change physical switches while node was locked
     * by remote programming. Changes were ignored
     */
    {
        name: 'RcUserFail',
        code: 0x000f,
        definition: 'User changed switch settings when address locked by remote programming. User changes ignored.'
    },
    /**
     * Factory reset performed
     * Node has performed a factory reset to default configuration
     */
    {
        name: 'RcFactoryRes',
        code: 0x000f,
        definition: 'Factory reset has occurred.'
    },
]

/**
 * @exports AT_REPORT_CODES
 * @property {ReportCodeDefinition[]} AT_REPORT_CODES - Array of Art-Net report code definitions
 */
module.exports = {
    AT_REPORT_CODES
}