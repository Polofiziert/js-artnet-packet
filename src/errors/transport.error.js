const ArtNetError = require('./base.error')

class ArtNetTransportError extends ArtNetError {
  constructor(errorCode, message, err) {
    super(message);
    this.errorCode = errorCode
    this.code = err?.code
    this.name = 'ArtNetTransportError'
  }
}

module.exports = {
    ArtNetTransportError
}