const { Buffer } = require('node:buffer');
const {ArtNetConstants} = require('../../constants');
const {AT_OPCODES, AT_REPORT_CODES, AT_STYLE_CODES, AT_OEM_CODES} = require('../../codes');
const {ArtNetMinPacket, ArtNetPacket} = require("../");