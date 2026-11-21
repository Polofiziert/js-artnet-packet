/**
 * @fileoverview Base class for ArtNet Paket Objekte.
 * @module
 * @author polofiziert
 * @version 0.0.1
 */
import { ID, PROT_VER } from './constants.ts'


/**
 * Abstract Artnet Packet Class for ArtNet Packets to inherit from.
 * Every ArtNetPacket has is Buffer. This is the raw Buffer from for example, an received message .
 */
export abstract class ArtnetPacket {
    abstract readonly type:string;
    readonly buffer: Buffer;

    constructor(buffer: Buffer) {
        this.buffer = buffer;
    }
}



/**
 * Checks the Header of an Packet Buffer for correctness.
 * @param buf the buffer to check.
 * @param opCode the expected opCode for the Packet.
 * @param minLength the minimum Length of the Packet.
 */
export function checkHeader(buf: Buffer, opCode: number, minLength: number): boolean{
    return buf.length >= minLength
        && buf.compare(ID, 0, 8, 0, 8) === 0
        && buf.readUInt16LE(8) === opCode        // OpCode: little-endian
}

/**
 * Writes a ArtNet Header with given OpCode to a given buffer
 * HeaderLayout:
 * ID: bytes 0-7; OpCode byte 8-9; ProtVerHi byte 10; ProtVerLo byte 11;
 * @param buf
 * @param opCode
 */
export function writeHeader(buf: Buffer, opCode:number): void{
    ID.copy(buf, 0)                         // Byte 0-7 Art-Net0x00 in ascii: 41 72 74 2D 4E 65 74 00
    buf.writeUInt16LE(opCode, 8)
    buf.writeUInt16BE(PROT_VER, 10)            // ProtVer: big-endia: 00 0e
}