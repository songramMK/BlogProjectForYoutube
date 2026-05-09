const bcrypt = require('bcrypt') ; 
const dotenv = require('dotenv'); 
dotenv.config() ; 

const HashPasswordGenerate = async(password)=>{
    return await bcrypt.hash(password, process.env.SALT);
}
const CompareHashPasword = async(password , hashpassword)=>{
    return await bcrypt.compare(password, hashpassword) ; 
}
module.exports = HashPasswordGenerate ; 