const {Buffer} = require('node:buffer')

// Reconstruct - Extentions
// Here are helper / extention Functions for the nodeModule Reconstruct a schema parser.
// They help process fields the parser doesnt have for itself
// For that they use the given API of Reconstruct
// all Reconstruct field types are functions that have a encode(), decode() and size() methods
// 
// encode()   takes a stream as UInt8Array and a obj as the field structure. they dont return but write the result to the stream
// decode()   only takes a stream UInt8Array and decode it to the wanted data. they return the result
// size()     gives the size of the field in bytes. it is used to calculate packetsize and to determine the stream length for decode()
// 
// to write and read strings Reconstruct provides helper function: writeString and readString

/**
 * Reconstruct extention - Mapped Bitfield
 * Function for a bitfield Type that maps bits to human-readable strings.
 * @param {Object} bitMap - Definitions: { key: { bits: [start, count], map: { "label": value } } }
 */
const MappedBitfield = (bitMap) => ({
  size() { return 1; },
  
  encode(stream, obj) {
    let byte = 0;
    for (const [key, config] of Object.entries(bitMap)) {
      const [start, count] = config.bits;
      const rawValue = config.map ? config.map[obj[key]] : obj[key];
      // Mask value to fit bit count, shift to position, and OR into byte
      byte |= ((rawValue || 0) & ((1 << count) - 1)) << start;
    }
    stream.writeUInt8(byte);
  },

  decode(stream) {
    const byte = stream.readUInt8();
    const result = {};
    for (const [key, config] of Object.entries(bitMap)) {
      const [start, count] = config.bits;
      const rawValue = (byte >> start) & ((1 << count) - 1);
      
      if (config.map) {
        // Reverse lookup for string label
        const label = Object.keys(config.map).find(k => config.map[k] === rawValue);
        result[key] = label || rawValue;
      } else {
        result[key] = rawValue;
      }
    }
    return result;
  }
});

/**
 * Reconstruct extention - FixedString
 * Function for a string-with-fixed-lenth Type that translates Strings into uint8 Array/Buffers of given length.
 * If strings are to short for the given length, it gets filled with \0 00.
 * If strings are to long they get cut to given lenth
 * @param {number} length - Definitions: lenth in bytes of the unit8 text string
 */
const FixedString = (length) => ({
    size() { return length; },
  
    encode(stream, obj) {
        // subString: cut string to lenth, padEnd: fill the string with \0 to lenth
        // writeString:  write string to stream
        stream.writeString(obj.substring(0,length).padEnd(length, "\0"), "utf8")
    },

    decode(stream) {
        let string = stream.readString(length, "utf8");
        string = string.replace(/\0/g, '') // get rid of the \0 from short string by regEx pattern.
        return string;
    }
});


const MappedEnum = (map) => ({
  size() { return 1; },
  
  encode(stream, obj) {
    let byte = 0;
    for (const [key, value] of Object.entries(map)) {
      if(key == obj){
        stream.writeUInt8(value);
        return null
      }
    }
  },

  decode(stream) {
    const byte = stream.readUInt8();
    for (const [key, value] of Object.entries(map)) {
      if(value == byte){
        return key
      }
    }
  }
});

module.exports = {
  MappedBitfield,
  FixedString,
  MappedEnum
}