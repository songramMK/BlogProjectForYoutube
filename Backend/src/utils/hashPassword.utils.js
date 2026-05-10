const bcrypt = require('bcrypt') ; 
const dotenv = require('dotenv'); 
dotenv.config() ; 

const HashPasswordGenerate = async(password)=>{
    const HashPassword =  await bcrypt.hash(password, Number(process.env.SALT));
    return HashPassword; 
}
const CompareHashPasword = async(password , hashpassword)=>{
    return await bcrypt.compare(password, hashpassword) ; 
}
module.exports = { HashPasswordGenerate, CompareHashPasword }; 