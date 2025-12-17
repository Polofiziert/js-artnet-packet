/**
 * Art-Net Report Codes
 * These codes are reported by Art-Net nodes in ArtPollReply packets to indicate
 * their current status and any operational issues or events that have occurred.
 * Report codes help controllers understand node health and configuration state.
 *
 * @typedef {Object} PriorityCodeDefinition
 * @property {string} name - The priority code identifier (e.g., 'DpLow')
 * @property {number} code - The hex code value (e.g., 0x0001)
 * @property {string} definition - Human-readable definition of what the code means
 *
 * @type {PriorityCodeDefinition[]}
 *
 * @example
 * // Find a specific priority code
 * const DpLow = AT_PRIORITY_CODES.find(prio => prio.name === 'DpLow');
 * console.log(DpLow.definition); // 'Low priority message.'
 *
 * @example
 * // Map all priority codes to a lookup object
 * const prioCodeMap = {};
 * AT_PRIORITY_CODES.forEach(prio => {
 *   prioCodeMap[prio.code] = prio.name;
 * });
 */

const AT_PRIORITY_CODES = [
    {
        name: 'DpAll',
        code: 0x00,
        definition: 'Low priority message.'
    },
    {
        name: 'DpLow',
        code: 0x10,
        definition: 'Low priority message.'
    },
    {
        name: 'DpMed',
        code: 0x40,
        definition: 'Medium priority message. '
    },
    {
        name: 'DpHigh',
        code: 0x80,
        definition: 'High priority message. '
    },
    {
        name: 'DpCritical',
        code: 0xe0,
        definition: 'Critical priority message. '
    },
    {
        name: 'DpVolatile',
        code: 0xf0,
        definition: 'Volatile message. Messages of this type are displayed on a single line in the DMX-Workshop diagnostics display. All other types are displayed in a list box.'
    },
]

/**
 * @exports AT_PRIORITY_CODES
 * @property {PriorityCodeDefinition[]} AT_PRIORITY_CODES - Array of Art-Net report code definitions
 */
module.exports = {
    AT_PRIORITY_CODES
}