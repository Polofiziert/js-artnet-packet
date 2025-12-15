/**
 * Constants Module
 * Aggregates and re-exports all Art-Net protocol constants for easy access.
 * Includes network configuration, timing requirements, and protocol identifiers.
 *
 * @module lib/constants
 * @description Re-exports the constants from ./constants.js with JSDoc typing
 */

/** @typedef {import('./constants').ArtNetConstants} ArtNetConstants */

const ArtNetConstants = require('./constants');

/**
 * Exported Art-Net constants object
 * @type {{
 *   AT_ID: string,
 *   AT_PROT_VER_HI: number,
 *   AT_PROT_VER_LO: number,
 *   AT_PORT: number,
 *   AT_DIRECT_BROADCAST_IP: string,
 *   AT_LIMITED_BROADCAST_IP: string,
 *   AT_ARTPOLL_TIMEOUT: number,
 *   AT_ARTPOLL_RYTHM: number,
 *   AT_ARTDMX_NC_RYTHM: number,
 *   AT_ARTDMX_MERGE_TIMEOUT: number,
 *   AT_ARTSYNC_TIMEOUT: number,
 *   AT_ARTFIRMWAREREPLY_TIMEOUT: number,
 *   AT_DISPLAYOFSTATUS_COM_TIMEOUT: number,
 *   AT_DISPLAYOFSTATUS_DMX_TIMEOUT: number
 * }}
 */
module.exports = {
  ...ArtNetConstants,
};
