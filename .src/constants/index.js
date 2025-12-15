/**
 * Constants index
 */

const protocol = require('./protocol');
const opcodes = require('./opcodes');

module.exports = {
  ...protocol,
  ...opcodes,
};
