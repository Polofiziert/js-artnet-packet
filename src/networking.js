const client = dgram.createSocket('udp4');
const os = require('node:os')



class ArtNetNetwork {
    constructor(socket){
        this.socket = socket
    }

    bind(){
        this.socket.bind({
            address: ipAddres,
            port: 6454,
            exclusive: true,
        })
    }



}