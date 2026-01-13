# js-artnet-packet
jap! Jet another artnet Packet.

# Quick start: 
## Send and receive | Output, Input
Simply send and receive Dmx over Ethernet. Input or Output DMX.

```js
const { jap } = require("./src/jap")
let japArtnet = new jap

let artnetProtocol = japArtnet.createArtNetProtocol({
    host: "2.0.0.102",
    port: 6454,
})

artnetProtocol.send('artDmx', { address, {net: 0, subNet: 0, universe: 0}, [dmxdata] } )
artnetProtocol.on('artDmx', (data)=>{
    console.log(data)
})
```
Sends Art-Net DMX Packets (artDmx) to the given address. If the receiver on the address is assigned to Net, Sub-Net and Universe, it can put out the artDmx as DMX-512 to the Fixtres. (Net, Sub-Net and Universe are part of the bigger Artnet Addressing ontop of the DMX-512 Start address in on universe.)


## Call and response | Discover
Be seen in the network and see others on network. Be Discovered.
```js

const { jap } = require("./src/jap)
let japArtnet = new jap

let artnetProtocol = japArtnet.createArtNetProtocol({
    host: "2.0.0.102",
    port: 6454,
})

let artnetDiscover = japArtnet.createArtNetDiscover({
    sname: "jap!",
    lname: "js-artnet-package",
    nodeReportText: "zzzzz...This node Feels very gooood!!!",
    nodeReportCode: "0x0001",
    style: "stController",
    refreshRate: 44, // in Hz
    address: {    // Art-Net Sub-net and Net of the Controller, Art-Net universe is on the Port Level -> not here
        net: 0,
        sub: 0,
    },
})

artnetDiscover.on('reply', (msg) => {
    console.log(msg)
})

artnetDiscover.listen()

```
Listens to other Art-Net devices on the network. Replys to other devices with the given data (sname, lname, ...). 

## Node Management | Know your Neigbours
When seen someone new, remember them. When in need, talk to them.
```js

const { jap } = require("./src/jap)
let japArtnet = new jap

let artnetProtocol = japArtnet.createArtNetProtocol({
    host: "2.0.0.102",
    port: 6454,
})

let artnetDiscover = japArtnet.createArtNetDiscover({
    sname: "jap!",
    lname: "js-artnet-package",
    nodeReportText: "zzzzz...This node Feels very gooood!!!",
    nodeReportCode: "0x0001",
    style: "stController",
    refreshRate: 44, // in Hz
    address: {    // Art-Net Sub-net and Net of the Controller, Art-Net universe is on the Port Level -> not here
        net: 0,
        sub: 0,
    },
})

// ####### Node Manager #########

let artnetNodeManager = new japArtnet.createArtNetNodeManager()

artnetDiscover.on('message', (msg) => {
   artnetNodeManager.newNode(msg)
  
  let currentNodes = artnetNodeManager.nodes()
  console.log(currentNodes)
})

artnetDiscover.listen()

```
When artnetDiscover gets a reply, it calls the artnetNodeManager and this saves the node.

## DMX loopp | Keep Shouting

```js

const { jap } = require("./src/jap)
let japArtnet = new jap

let artnetProtocol = japArtnet.createArtNetProtocol({
    host: "2.0.0.102",
    port: 6454,
})

let artnetDmxLoop = japArtnet.artnetDmxLoop({ address, {net: 0, subNet: 0},  { universe: 0, data: [dmxdata]} }, { universe: 1, data: [dmxdata]} } )

artnetDmxLoop.start()

artnetDmxLoop.update({ universe: 0, data: [dmxdata]} })
artnetDmxLoop.update({ universe: 1, data: [dmxdata]} })
artnetDmxLoop.update({ universe: 0, data: [dmxdata]} })
```




# Functions to explain
- PollReplyPacket
- PollPacket
- ArtnetCodes
- PollRepySchema
- PollSchema
- MappedBitfield
- MappedEnum
- FixedString
- toBinString
- toBinStringPretty
- toHexString
- toHexStringPretty

- ArtNetPackets


# Contributions
- restructure
  + for packet to buffer parsing
  + 
