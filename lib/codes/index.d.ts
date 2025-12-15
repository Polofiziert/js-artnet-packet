// Type definitions for js-artnet-packet `lib/codes`
// Generated JSDoc -> TypeScript declarations to help TypeScript consumers and editors

export type OpCodeDefinition = {
  name: string;
  code: number;
  definition: string;
};

export type ReportCodeDefinition = {
  name: string;
  code: number;
  description: string;
};

export type StyleCodeDefinition = {
  name: string;
  code: number;
  description: string;
};

export type OemCodeEntry = {
  Mnemonic: string;
  OemCode: string;
  Manufacturer: string;
  ESTA_Man_Code: string;
  Product: string;
  DMX_in: number;
  DMX_out: number;
  Are_ports_Physical: string;
  IsRDM_supported: string;
  Website: string;
};

/**
 * Top-level exports from `lib/codes/index.js`.
 * These constants are also available via `require('./lib/codes')`.
 */
export const AT_OPCODES: OpCodeDefinition[];
export const AT_REPORT_CODES: ReportCodeDefinition[];
export const AT_STYLE_CODES: StyleCodeDefinition[];
export const AT_OEM_CODES: OemCodeEntry[];

export default {
  AT_OPCODES,
  AT_REPORT_CODES,
  AT_STYLE_CODES,
  AT_OEM_CODES,
};
