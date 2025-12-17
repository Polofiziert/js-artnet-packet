// Definining a Field of the Artnet Protocol
// gives basic funktion to convert fields from bin to obj and back

const ipRegEx = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
const versRegEx = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
const netSwRegEx = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

class ArtNetField{
    constructor(name, size, count){
        this.name = name
        this.size = size
        this.sizeCount = count
        this.data = {}
    }
}

// Reads an IpAddres as Array or String and puts it to an buffer
// fIpAddr = new fieldIpAddr("192.168.1.10") or fIpAddr = new fieldIpAddr([192,168,1,10])
class FieldIpAddr extends ArtNetField{
    constructor(ipAddr){
        super("ipAddress", "UInt8", 4)
        this.setIpAddress(ipAddr)
    }

    setIpAddress(addr){
        let e = {status: null}
        if (Array.isArray(addr)){
            this.data.ipAddr = addr
            e.status = "0k"
        }else{
            e.status = new Error("Not a valid Ip Address array!")
        }
        if (typeof addr == "string" && ipRegEx.test(addr)){
            this.data.ipAddr = addr.split('.').map((num)=>parseInt(num, 10))
            e.status = "0k"
        }else{
            e.status = new Error("Not a valid Ip Address string!")
        }
        return e
    }
    // Writes the Address of th field to the given Buffer at the offset, Returns the Offset
    toBuffer(buf, offset){
        offset = buf.writeUInt8(this.data.ipAddr[0], offset)
        offset = buf.writeUInt8(this.data.ipAddr[1], offset)
        offset = buf.writeUInt8(this.data.ipAddr[2], offset)
        offset = buf.writeUInt8(this.data.ipAddr[3], offset)
        return offset
    }
    // Reads the Address from the given buffer at the offset, returns the Offset and stores the addres
    fromBuffer(buf, offset){
        const ipAddr = [0, 0, 0, 0]
        offset = buf.readUInt8(ipAddr[0], offset)
        offset = buf.readUInt8(ipAddr[1], offset)
        offset = buf.readUInt8(ipAddr[2], offset)
        offset = buf.readUInt8(ipAddr[3], offset)
        this.data.ipAddr = ipAddr
        return offset
    }
}

// Reads an versInfo as Array or String and puts it to an buffer
// fversionInfo = new fieldVersionInfo("192.168.1.10") or fversionInfo = new fieldVersionInfo([192,168,1,10])
class FieldVersionInfo extends ArtNetField{
    constructor(versionInfo){
        super("versInfo", "UInt8", 2)
        this.setVersionInfo(versionInfo)
    }

    setVersionInfo(vers){
        var e = {status: null}
        if (Array.isArray(vers)){
            this.data.versInfo = vers
            e.status = "0k"
        }else{
            e.status = new Error("Not a valid VersionInfo array! [x, y] needed")
        }
        if (typeof vers == "string" && versRegEx.test(vers)){
            this.data.versInfo = vers.split('.').map((num)=>parseInt(num, 10))
            e.status = "0k"
        }else{
            e.status = new Error("Not a valid VersionInfo string! x.y needed")
        }
        return null
    }

    toBuffer(buf, offset){
        offset = buf.writeUInt8(this.data.versInfo[0], offset)
        offset = buf.writeUInt8(this.data.versInfo[1], offset)
        return offset
    }

    fromBuffer(buf, offset){
        this.data.versInfo[0] = buf.readUInt8(offset)
        this.data.versInfo[1] = buf.readUInt8(offset+1)
        return offset+3
    }
}


class FieldNetSwitch extends ArtNetField{
    constructor(netSwitch){
        super("NetSwitch", "UInt8", 1)
        this.setNetSwitch(netSwitch)
    }

    setNetSwitch(netSwitch){
        let e = {status: null}
        if (Array.isArray(netSwitch) && netSwitch.length == this.sizeCount){
            this.data.netSwitch = netSwitch
            e.status = "0k"
        }else{
            e.status = new Error("Not a valid netSwitch array! [x] needed")
        }
        if (typeof netSwitch == "string" && netSwRegEx.test(netSwitch)){
            this.data.netSwitch = netSwitch.split('.').map((num)=>parseInt(num, 10))
            e.status = "0k"
        }else{
            e.status = new Error("Not a valid netSwitch string! 'x' needed")
        }
        return null
    }

    toBuffer(buf, offset){
        for(let i = 0; i < this.sizeCount;){
            offset = buf.writeUInt8(this.data.netSwitch[i], offset)
            i++;
        }
        return offset
    }

    fromBuffer(buf, offset){
        this.data.netSwitch[0] = buf.readUInt8(offset)
        this.data.netSwitch[1] = buf.readUInt8(offset+1)
        return offset+3
    }
}

var status1 = {
    indicatorState : "unknown",
    portAddressProgramminAuth : "unknown",
    bootedFromRom: false,
    isRdm : false,
    hasUbea : false
}

class FieldStatus1 extends ArtNetField{
    constructor(status1){
        super("Status1", "UInt8", 1)
        this.setStatus1(status1)
    }

    setStatus1(netSwitch){
        this.data.status = {}
        return null
    }

    toBuffer(buf, offset){
        return offset
    }

    fromBuffer(buf, offset){
        return offset+3
    }
}


module.exports = {
    ArtNetField,
    FieldIpAddr,
    FieldNetSwitch,
    FieldVersionInfo
}