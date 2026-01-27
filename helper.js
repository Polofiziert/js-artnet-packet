function toBinString(arr) {
    if(arr){
        return Array.from(arr)
        .map(byte => byte.toString(2).padStart(8, '0'))
        .join(' ') 
    }else{
        return
    }
}

function toHexString(arr) {
    if(arr){
        return Array.from(arr)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join(' ') 
    }else{
        return
    }
}

function toHexStringArray(arr) {
    if(arr){
        return Array.from(arr)
        .map(byte => byte.toString(16).padStart(2, '0').padStart(4, '0x'))
        .join(', ') 
    }else{
        return
    }
}

function toBinStringPretty(arr, line) {
    let regEx = new RegExp("(.{" + line + "})", "g")
    if(arr){
        return Array.from(arr)
        .map(byte => byte.toString(2).padStart(8, '0'))
        .join(' ').replace(/ /g,"").replace(regEx,"$1\n")
        .replace(/(.{8})/g, "$1 ") + "\nBytes: " + arr.length
    }else{
        return
    }
}

function toHexStringPretty(arr, line) {
    let regEx = new RegExp("([0-9,a-f]{" + line + "})", "g")
    if(arr){
        return Array.from(arr)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join(' ')
        .replace(/ /g,"")
        .replace(regEx,"$1\n")
        .replace(/([0-9,a-f]{16})/g,"$1  ")
        .replace(/(.{2})/g, "$1 ")
        + "\nBytes: " + arr.length
    }else{
        return
    }
}

function checkIp(ip) {
    let ipv4 = 
        /^(\d{1,3}\.){3}\d{1,3}$/;
    let ipv6 = 
        /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4.test(ip) || ipv6.test(ip);
}


module.exports = {
    toBinString,
    toHexString,
    toBinStringPretty,
    toHexStringPretty,
    toHexStringArray,
    checkIp,
}