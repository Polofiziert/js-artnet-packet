const { jap } = require('./src/jap')
const justArtnet = new jap()

const artnetProtocol = justArtnet.createArtNetProtocol({
    host: '127.0.0.1', // Host PC Address
    port: 6454, // Standart Art-Net Port
})

artnetProtocol.on('message', (msg, rinfo) => {
    console.log(`--- Message rInfo: ${rinfo.address}, ${rinfo.port}; ---`)
    console.log("Message content: ", JSON.stringify(msg.data))
})

artnetProtocol.on('error', (e) => {
    console.log(`--- ERROR: ${e}; ---`)
})

artnetProtocol.on('listening', () => {
    // send('packetType', 'receiving node IP Address', options)
    artnetProtocol.send('artDmx', '127.0.0.1', {
        portAddress: { net: 0, subNet: 16, universe: 2 },
        data: [100, 2, 100, 2],
    })

    artnetProtocol.send('artPoll', '127.0.0.1', {
        flags: {
            targetedMode: 'on',
            vlcTransmission: 'on',
            broadcastDignostics: 'yes',
            sendDiagnostics: 'yes',
            sendOnChange: 'no',
        },
        diagPriority: 'dpVolatile',
        targetPortAddress: [0, 0, 0, 1],
    })

    artnetProtocol.send('artPollReply', '127.0.0.1', {
        versionInfo: [0, 1],
        portName: 'js-artnet-package',
        longName: 'js-artnet-package jep!',
        style: 'stController',
    })

    // artnetProtocol.close()
})

artnetProtocol.bind()
