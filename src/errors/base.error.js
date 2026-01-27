// ArtNetError.js

class ArtNetError extends Error {
    constructor (errorCode, description) {
        super(description)

        Object.setPrototypeOf(this, new.target.prototype)
        this.name = "ArtNetError"
        this.errorCode = errorCode
        Error.captureStackTrace(this)
    }
}

module.exports = ArtNetError