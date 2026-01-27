const ArtNetError = require('./base.error')

class ArtNetPacketError extends ArtNetError {
    constructor(errorCode, message, opcode) {
        super(message)
        this.errorCode = errorCode
        this.opcode = opcode
        this.name = 'ArtNetPacketError'
    }
}

module.exports = {
    ArtNetPacketError
}