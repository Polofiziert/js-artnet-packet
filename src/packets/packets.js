class ArtNetPackets {
    constructor(schema, minSize){
        this.schema = schema
        this.minSize = minSize
        this.data = {}
        this.counters = {}
    }

    encode (){
        return this.schema.toBuffer(this.data)
    }

    decode (buffer) {
        this.data = this.schema.fromBuffer(buffer)
        return this.data
    }

    _conterUp(rollOver, value){
        value < rollOver ? value = value + 1 : value = 0
        return value
    }

    _increntCounters(){
        for (const [counterName, info] of Object.entries(this.counters)) {
            info.value = this._conterUp(info.rollOver, info.value)
        }
    }
}



module.exports = {
    ArtNetPackets
}