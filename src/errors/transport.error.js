const ArtNetError = require('./base.error')

class ArtNetTransportError extends ArtNetError {
  constructor(errorCode, call, description) {
    super(errorCode, description);
    this.name = 'ArtNetTransportError'
    this.call = call
  }
}

module.exports = {
    ArtNetTransportError
}