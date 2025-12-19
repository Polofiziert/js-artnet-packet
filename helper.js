function toBinString(arr) {
    if(arr){
        return Array.from(arr)
        .map(byte => byte.toString(2).padStart(8, '0'))
        .join(' ') 
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
        .map(byte => byte.toString(16).padStart(1, '0'))
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


module.exports = {
    toBinString,
    toBinStringPretty,
    toHexStringPretty
}