const { AT_OPCODES } = require('./opcodes');
const {AT_REPORT_CODES} = require('./reportcodes');
const styleCodes = require('./stylecodes');
const oemCodes = require('./oemcodes');
const priorityCodes = require('./prioritycodes');


const ArtNetCodes = {
    getReportCode(name){
        let code
        AT_REPORT_CODES.forEach(element => {
            element.name == name ? code = element.code : null
        });
        return code
    },
    getReportCodeByCode(code){
        let name
        AT_REPORT_CODES.forEach(element => {
            element.code == code ? name = element.name : null
        });
        return name
    },
    getReportCodeDefinition(name){
        let definition
        AT_REPORT_CODES.forEach(element => {
            element.name == name ? definition = element.definition : null
        });
        return definition
    },
    getReportCodeDefinitionByCode(code){
        let definition
        AT_REPORT_CODES.forEach(element => {
            element.code == code ? definition = element.definition : null
        });
        return definition
    },

    getOpCode(name){
        let code
        AT_OPCODES.forEach(element => {
            element.name == name ? code = element.code : null
        });
        return code
    },
    getOpCodeByCode(code){
        let name
        AT_OPCODES.forEach(element => {
            element.code == code ? name = element.name : null
        });
        return name
    },
    getOpCodeDefinition(name){
        let definition
        AT_OPCODES.forEach(element => {
            element.name == name ? definition = element.definition : null
        });
        return definition
    },
    getOpCodeDefinitionByCode(code){
        let definition
        AT_OPCODES.forEach(element => {
            element.code == code ? definition = element.definition : null
        });
        return definition
    }
}


module.exports = {
  ArtNetCodes,
};
