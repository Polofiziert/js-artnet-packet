const ArtNetError = require('./base.error')

class ArtNetConfigurationError extends ArtNetError {
    constructor (errorCode, call, description) {
        super(errorCode, description)
        this.name = "ArtNetConfigurationError"
        this.call = call
    }
}

module.exports = {
    ArtNetConfigurationError
}