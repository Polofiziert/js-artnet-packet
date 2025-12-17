/**
 * Aggregated Codes Module
 * This module re-exports the various Art-Net code lists (opcodes, report codes,
 * style codes and OEM codes) and provides JSDoc typedef imports so editors can
 * surface accurate IntelliSense for nested objects and arrays.
 *
 * Usage in other files:
 * const codes = require('./lib/codes');
 * // codes.AT_OPCODES -> OpCodeDefinition[] with proper hover information
 */

/** @typedef {import('./opcodes').OpCodeDefinition} OpCodeDefinition */
/** @typedef {import('./reportcodes').ReportCodeDefinition} ReportCodeDefinition */
/** @typedef {import('./stylecodes').StyleCodeDefinition} StyleCodeDefinition */
/** @typedef {import('./oemcodes').OemCodeEntry} OemCodeEntry */
/** @typedef {import('./prioritycodes').PriorityCodeDefinition} PriorityCodeEntry */

const opCodes = require('./opcodes');
const reportCodes = require('./reportcodes');
const styleCodes = require('./stylecodes');
const oemCodes = require('./oemcodes');
const priorityCodes = require('./prioritycodes');


/**
 * Exported aggregated code lists.
 * @type {{
 *   AT_OPCODES: OpCodeDefinition[],
 *   AT_REPORT_CODES: ReportCodeDefinition[],
 *   AT_STYLE_CODES: StyleCodeDefinition[],
 *   AT_OEM_CODES: OemCodeEntry[]
 *   AT_PRIORITY_CODES: PriorityCodeEntry[]
 * }}
 */
module.exports = {
  ...opCodes,
  ...reportCodes,
  ...styleCodes,
  ...oemCodes,
  ...priorityCodes,
};
