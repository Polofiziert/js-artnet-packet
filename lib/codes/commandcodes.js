/**
 * Art-Net Report Codes
 * These codes are reported by Art-Net nodes in ArtPollReply packets to indicate
 * their current status and any operational issues or events that have occurred.
 * Report codes help controllers understand node health and configuration state.
 *
 * @typedef {Object} CommandCodeDefinition
 * @property {string} name - The command code identifier (e.g., 'SwoutText')
 * @property {number} code - The hex code value (e.g., SwoutText)
 * @property {string} definition - Human-readable definition of what the code means
 *
 * @type {CommandCodeDefinition[]}
 *
 * @example
 * // Find a specific command code
 * const DpLow = AT_COMMAND_CODES.find(com => com.name === 'DpLow');
 * console.log(DpLow.definition); // 'Low command message.'
 *
 * @example
 * // Map all command codes to a lookup object
 * const comCodeMap = {};
 * AT_COMMAND_CODES.forEach(com => {
 *   comCodeMap[com.code] = com.name;
 * });
 */

const AT_COMMAND_CODES = [
    {
        name: 'DpLow',
        code: 0x10,
        definition: 'Low command message.'
    },
    {
        name: 'DpMed',
        code: 0x40,
        definition: 'Medium command message. '
    },
    {
        name: 'DpHigh',
        code: 0x80,
        definition: 'High command message. '
    },
    {
        name: 'DpCritical',
        code: 0xe0,
        definition: 'Critical command message. '
    },
    {
        name: 'DpVolatile',
        code: 0xf0,
        definition: 'Volatile message. Messages of this type are displayed on a single line in the DMX-Workshop diagnostics display. All other types are displayed in a list box.'
    },
]

/**
 * @exports AT_COMMAND_CODES
 * @property {CommandCodeDefinition[]} AT_COMMAND_CODES - Array of Art-Net report code definitions
 */
module.exports = {
    AT_COMMAND_CODES
}