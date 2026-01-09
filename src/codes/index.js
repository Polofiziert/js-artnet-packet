const { AT_OPCODES } = require('./opcodes');
const {AT_REPORT_CODES} = require('./reportcodes');
const {AT_STYLE_CODES} = require('./stylecodes');
const {AT_OEM_CODES} = require('./oemcodes');
const {AT_PRIORITY_CODES} = require('./prioritycodes');


const ArtNetCodes = {
    // Report Codes
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

    //OpCodes
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
    },


    //OpCodes
    getOemCode(manufacturer){
        let code
        AT_OEM_CODES.forEach(element => {
            element.Manufacturer == manufacturer ? code = element.OemCode : null
        });
        return code
    },
    getOemCodeByCode(code){
        let codeObj
        AT_OPCODES.forEach(element => {
            element.OemCode == code ? codeObj = element : null
        });
        return codeObj
    },


    //Priority Codes
    getPrioCode(name){
        let code
        AT_PRIORITY_CODES.forEach(element => {
            element.name == name ? code = element.code : null
        });
        return code
    },
    getPrioCodeByCode(code){
        let name
        AT_PRIORITY_CODES.forEach(element => {
            element.code == code ? name = element.name : null
        });
        return name
    },
    getPrioCodeDefinition(name){
        let definition
        AT_PRIORITY_CODES.forEach(element => {
            element.name == name ? definition = element.definition : null
        });
        return definition
    },
    getPrioCodeDefinitionByCode(code){
        let definition
        AT_PRIORITY_CODES.forEach(element => {
            element.code == code ? definition = element.definition : null
        });
        return definition
    },

    // Style Codes
    getStyleCode(name){
        let code
        AT_STYLE_CODES.forEach(element => {
            element.name == name ? code = element.code : null
        });
        return code
    },
    getStyleCodeByCode(code){
        let name
        AT_STYLE_CODES.forEach(element => {
            element.code == code ? name = element.name : null
        });
        return name
    },
    getStyleCodeDefinition(name){
        let definition
        AT_STYLE_CODES.forEach(element => {
            element.name == name ? definition = element.definition : null
        });
        return definition
    },
    getStyleCodeDefinitionByCode(code){
        let definition
        AT_STYLE_CODES.forEach(element => {
            element.code == code ? definition = element.definition : null
        });
        return definition
    },
}


module.exports = {
  ArtNetCodes,
};
