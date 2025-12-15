/**
 * Art-Net OpCodes
 * Defines all operation codes for Art-Net packets
 */

const OpCodes = {
  // Device Discovery
  POLL: 0x2000,
  POLL_REPLY: 0x2101,

  // DMX Transport
  OUTPUT: 0x5000, // ArtDmx
  INPUT: 0x5001,
  
  // Synchronization
  SYNC: 0x2300,
  
  // Address Programming
  ADDRESS: 0x6000,
  INPUT_STATUS: 0x7000,
  
  // Diagnostics
  DIAG_DATA: 0x8000,
  TIME_CODE: 0x9700,
  
  // RDM
  TOD_REQUEST: 0x8000,
  TOD_DATA: 0x8100,
  TOD_CONTROL: 0x8200,
  RDM: 0x6A00,
  RDM_SUB: 0x6A01,
  
  // IP Programming
  IP_PROG: 0xF800,
  IP_PROG_REPLY: 0xF900,
  
  // Media
  VLC: 0x10000, // Virtual Light Control (placeholder)
  
  // Firmware
  FIRMWARE_MASTER: 0xF200,
  FIRMWARE_REPLY: 0xF300,
  
  // Other
  COMMAND: 0x2400,
  NZS: 0x5200,
  TRIGGER: 0x9900,
  DATA_REQUEST: 0xCC00,
  DATA_REPLY: 0xCC01,
};

// Reverse mapping for debugging
const OpCodeNames = Object.entries(OpCodes).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

module.exports = {
  OpCodes,
  OpCodeNames,
};
