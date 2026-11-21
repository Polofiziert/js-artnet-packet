import { japArtnet } from "js-artnet-packet";

/*
Controller
 */

const artnet = createArtnet({
    type: 'interface',
    interface: 'en0',
    mode: 'both',
});

let artnetController = japArtnet.createController({
    host: "2.0.0.102",
    port: 6454,
    logger: "logger",
    socket: "socket"
    // More config coming
})

await artnetController.listen(); // Can get the ip here also
// The controller is now listening and responding to discovery traffic

await artnetController.send('artTc', 'ipAddr', {type: 'EBU', positionMillis: 12.345});
await artnetController.send('artDmx', 'ipAddr', { "address", {net: 0, subNet: 0, universe: 0}, ["dmxdata"] } )

// Send DMX data (Sequence 0, Physical input port 0, Universe 0.
await artnetController.sendBroadcastPacket(new ArtDmx(0, 0, 0, [255, 0, 0]));

artnetController.on('artDmx', (dmx)=>{
    // dmx contains an ArtDmx object
    console.log(dmx.universe, dmx.data);
})

artnetController.on('timecode', (event) => {
    console.log(
        `Received ${event.mode} ${event.hours}:${event.minutes}:${event.seconds}:${event.frame} from ${event.host}:${event.port}`,
    );
    console.log(`Position in milliseconds: ${event.timeMillis}`);
});

artnetController.on('nodeAdded', (n) => {})
artnetController.discover({ intervalMs: 3000 })

const dmxOutput = artnetController.output({ net: 0, subnet: 0, universe: 1 })
dmxOutput.set(1, 255)
dmxOutput.set([10, 20, 30], 5)
dmxOutput.flush()  // oder out.autoFlush({ hz: 40 })


artnetController.on('error', (error) => {
    console.error('Art-Net error', error);
});

const positionMillis = 12_345;
await artnetController.sendTimecode('EBU', positionMillis);

artnetController.close();


/*
Node
 */

const artnetNode = japArtnet.createNode({ socket, ip, name: 'My Node', ports: [...] })
artnetNode.input({ net: 0, subnet: 0, universe: 1 })
    .on('dmx', (data, meta) => {})
await artnetNode.start()
await artnetNode.close()
