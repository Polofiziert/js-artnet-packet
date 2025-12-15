/**
 * Art-Net Style Codes
 * These codes classify the type or role of an Art-Net node (e.g. Controller, Media Server).
 * They are used in ArtPollReply and related packets to inform controllers about device type.
 *
 * @typedef {Object} StyleCodeDefinition
 * @property {string} name - Symbolic name for the style code (e.g. 'StController')
 * @property {number} code - Numeric code value (0x00 - 0xFF)
 * @property {string} definition - Human readable definition of the device style
 *
 * @type {StyleCodeDefinition[]}
 *
 * @example
 * // Create a lookup by code
 * const styleByCode = Object.fromEntries(AT_STYLE_CODES.map(s => [s.code, s.name]));
 */
const AT_STYLE_CODES = [
    /**
     * Standard node (DMX I/O)
     * A device that converts between DMX and Art-Net (input/output)
     */
    {
        name: 'StNode',
        code: 0x00,
        definition: 'A DMX to / from Art-Net device'
    },
    /**
     * Lighting console / controller
     * Devices that originate lighting control data
     */
    {
        name: 'StController',
        code: 0x01,
        definition: 'A lighting console.'
    },
    /**
     * Media server
     * Servers that provide media playback, video, or frame-based outputs
     */
    {
        name: 'StMedia',
        code: 0x02,
        definition: 'A Media Server.'
    },
    /**
     * Network routing device
     * Devices that route Art-Net or DMX between networks/segments
     */
    {
        name: 'StRoute',
        code: 0x03,
        definition: 'A network routing device.'
    },
    /**
     * Backup device
     * Devices intended to act as backups for controllers or show data
     */
    {
        name: 'StBackup',
        code: 0x04,
        definition: 'A backup device.'
    },
    /**
     * Configuration / diagnostic tool
     * Tools used to configure or diagnose Art-Net nodes
     */
    {
        name: 'StConfig',
        code: 0x05,
        definition: 'A configuration or diagnostic tool.'
    },
    /**
     * Visualiser
     * Software/hardware that visualises lighting output for previews
     */
    {
        name: 'StVisual',
        code: 0x06,
        definition: 'A visualiser.'
    },
]

/**
 * @exports AT_STYLE_CODES
 * @property {StyleCodeDefinition[]} AT_STYLE_CODES - Array of Art-Net style code definitions
 */
module.exports = {
    AT_STYLE_CODES
}