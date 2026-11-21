/**
 * @fileoverview Implementation of the decode function for OpCode matched decoding.
 * @author polofiziert
 * @version 0.0.1
 */

import { ID, OpCode } from './constants.ts'
import { ArtDmx } from './ArtDmx.ts'

export type UnknownPacket = { type: 'unknown'; opCode: number; raw: Buffer }
export type Packet = ArtDmx | UnknownPacket

/**
 * Checks if a Packet is an ArtNet Packet, if so: Checks the opCode and returns an ArtnetPacket.
 * @param buf Unknown message buffer (for example from dgram)
 * @returns {ArtnetPacket | null} - an ArtnetPacket Object if the buf was an valid ArtNet packet. Null if packet in buf was not ArtNet.
 */
export function decode(buf: Buffer): Packet | null {
    if (buf.length < 10 || buf.compare(ID, 0, 8, 0, 8) !== 0){
        return null;
    }
    const op = buf.readUInt16LE(8)
    switch (op) {
        case OpCode.ArtDmx:  return ArtDmx.decode(buf)
        default:             return { type: 'unknown', opCode: op, raw: buf }
    }
}