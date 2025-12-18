function toBinString(arr) {
    if(arr){
        return Array.from(arr)
        .map(byte => byte.toString(2).padStart(8, '0'))
        .join(' ') 
    }else{
        return
    }
}




module.exports = {
    toBinString,

}