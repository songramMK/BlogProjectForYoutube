const otpGenerate = ()=>{
    return Math.floor(1000000 +  Math.random() * 999999).toString() ; 
}
module.exports = otpGenerate