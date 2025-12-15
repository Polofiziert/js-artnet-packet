const {AT_OPCODES, AT_REPORT_CODES, AT_STYLE_CODES, AT_OEM_CODES} = require('.');

/*
console.log(AT_OPCODES);
console.log("-------------------------------------");
console.log(AT_REPORT_CODES);
console.log("-------------------------------------");
console.log(AT_STYLE_CODES);
console.log("-------------------------------------");
console.log(AT_OEM_CODES);
console.log("-------------------------------------");
*/

console.log("-------------------------------------");
console.log(AT_OPCODES[2].name);
console.log(AT_OPCODES[2].code);
console.log(AT_OPCODES[2].definition);
console.log("-------------------------------------");

console.log("-------------------------------------");
console.log(AT_REPORT_CODES[2].name);
console.log(AT_REPORT_CODES[2].code);
console.log(AT_REPORT_CODES[2].definition);
console.log("-------------------------------------");

console.log("-------------------------------------");
console.log(AT_STYLE_CODES[2].name);
console.log(AT_STYLE_CODES[2].code);
console.log(AT_STYLE_CODES[2].definition);
console.log("-------------------------------------");

console.log("-------------------------------------");
console.log(AT_OEM_CODES[2].OemCode);
console.log(AT_OEM_CODES[2].Manufacturer);
console.log(AT_OEM_CODES[2].Mnemonic);
console.log(AT_OEM_CODES[2].Website);
console.log(AT_OEM_CODES[2].Product);
console.log("-------------------------------------");

//ConstCodes.AT_OPCODES.forEach(code => {console.log(code);});
