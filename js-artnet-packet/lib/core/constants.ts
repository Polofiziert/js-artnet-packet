export const OpCode = { ArtPoll: 0x2000, ArtDmx: 0x5000 } as const
export const ARTNET_PORT = 6454
export const PROT_VER = 14
export const ID = Buffer.from('Art-Net\0', 'latin1')