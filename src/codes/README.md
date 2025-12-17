# Constan Codes
## Usage
Usage:
```js

const {AT_OPCODES, AT_REPORT_CODES, AT_STYLE_CODES} = require('./lib/codes');

console.log(AT_OPCODES);
console.log("-------------------------------------");
console.log(AT_REPORT_CODES);
console.log("-------------------------------------");
console.log(AT_STYLE_CODES);
console.log("-------------------------------------");


console.log("-------------------------------------");
console.log(AT_OPCODES[2].name);
console.log(AT_OPCODES[2].code);
console.log(AT_OPCODES[2].definition);
console.log("-------------------------------------");

console.log("-------------------------------------");
console.log(AT_REPORT_CODES[2].name);
console.log("-------------------------------------");

console.log("-------------------------------------");
console.log(AT_STYLE_CODES[2].name);
console.log("-------------------------------------");

```

## Types
AT_OPCODES: Array of Objects
AT_REPORT_CODES: Array of Objects
AT_STYLE_CODES: Array of Objects

```json
[
  {
    name: OpPoll',
    value: 8192,
    definition: 'This is an ArtPoll packet, no other data is contained in this UDP packet.'
  },
{ ... },
  {
    name: 'OpPollReply',
    value: 8448,
    definition: 'This is an ArtPollReply Packet. It contains device status information.'
  },
]
```

