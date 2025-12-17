/**
 * Type definitions for Art-Net constants module
 * Provides strong typing for protocol constants used throughout the library
 */

export type ArtNetConstants = {
  /** Art-Net protocol identifier: "Art-Net\0" (8 bytes with null terminator) */
  AT_ID: string;

  AT_PROT_VER_HI: number;

  AT_PROT_VER_LO: number;

  /** UDP port for Art-Net protocol (6454 decimal, 0x1936 hex) */
  AT_PORT: number;

  /** Directed broadcast address for ArtPoll discovery */
  AT_DIRECT_BROADCAST_IP: string;

  /** Limited broadcast address (not used for Art-Net, but defined in spec) */
  AT_LIMITED_BROADCAST_IP: string;

  /** Maximum timeout (seconds) for receiving all ArtPollReply responses */
  AT_ARTPOLL_TIMEOUT: number;

  /** Required interval (seconds) for broadcasting ArtPoll packets */
  AT_ARTPOLL_RYTHM: number;

  /** Re-transmission interval (seconds) for unchanged DMX data */
  AT_ARTDMX_NC_RYTHM: number;

  /** Timeout (seconds) for DMX merge mode before fallback */
  AT_ARTDMX_MERGE_TIMEOUT: number;

  /** Timeout (seconds) for ArtSync before non-synchronous fallback */
  AT_ARTSYNC_TIMEOUT: number;

  /** Maximum timeout (seconds) for firmware upload acknowledgment */
  AT_ARTFIRMWAREREPLY_TIMEOUT: number;

  /** Timeout (seconds) for communication status LED indicator */
  AT_DISPLAYOFSTATUS_COM_TIMEOUT: number;

  /** Timeout (seconds) for DMX status LED indicator */
  AT_DISPLAYOFSTATUS_DMX_TIMEOUT: number;
};

export const AT_ID: string;
export const AT_PORT: number;
export const AT_PROT_VER_HI: number;
export const AT_PROT_VER_LO: number;
export const AT_DIRECT_BROADCAST_IP: string;
export const AT_LIMITED_BROADCAST_IP: string;
export const AT_ARTPOLL_TIMEOUT: number;
export const AT_ARTPOLL_RYTHM: number;
export const AT_ARTDMX_NC_RYTHM: number;
export const AT_ARTDMX_MERGE_TIMEOUT: number;
export const AT_ARTSYNC_TIMEOUT: number;
export const AT_ARTFIRMWAREREPLY_TIMEOUT: number;
export const AT_DISPLAYOFSTATUS_COM_TIMEOUT: number;
export const AT_DISPLAYOFSTATUS_DMX_TIMEOUT: number;

/** Runtime object containing all constants */
export const ArtNetConstants: ArtNetConstants;

export default {
  AT_ID,
  AT_PORT,
  AT_PROT_VER_HI,
  AT_PROT_VER_LO,
  AT_DIRECT_BROADCAST_IP,
  AT_LIMITED_BROADCAST_IP,
  AT_ARTPOLL_TIMEOUT,
  AT_ARTPOLL_RYTHM,
  AT_ARTDMX_NC_RYTHM,
  AT_ARTDMX_MERGE_TIMEOUT,
  AT_ARTSYNC_TIMEOUT,
  AT_ARTFIRMWAREREPLY_TIMEOUT,
  AT_DISPLAYOFSTATUS_COM_TIMEOUT,
  AT_DISPLAYOFSTATUS_DMX_TIMEOUT,
};
