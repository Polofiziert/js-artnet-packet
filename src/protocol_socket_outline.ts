/*
Core - Pakete, Konstanten, Codec (rein)
 */
import { artnetPacket } from "../js-artnet-packet/lib/core/ArtnetPacket"

var receivedBuffer = Buffer.alloc(4);
var packet = artnetPacket.decode(receivedBuffer)
var packet2 = artnetPacket.create({sequence: 1, net: 2, sub: 3, universe: 1, data})

packet.setUniverse(1);
var subNet = packet.getSubnet();
    subNet = packet.subnet;

var transmitBuffer = packet.encode()

var valid: boolean = packet.validate()

/*
Socket - Transport-Interface + dgram-Standardtransport
 */

const sock = createSocket({ interface: '192.168.1.10' });
sock.on('ArtDmx', (pkt, rinfo) => { ... });
sock.on('ArtPoll', (pkt, rinfo) => { ... });
sock.send(packet, '192.168.1.255');

const sock = createSocket({ transport })        // oder Default-dgram
sock.on('ArtDmx', (pkt, rinfo) => {})
sock.on('packet', (pkt, rinfo) => {})           // alles, auch Unbekanntes
sock.on('ArtDmx', handler, { from: '192.168.1.20', universes: [1, 2, 3] })
await sock.listen({ port: 6454 })
sock.send(artPoll(), '192.168.1.255')
await sock.close()