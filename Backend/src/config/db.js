const mongoose = require('mongoose') ; 
const dotenv =require('dotenv') ; 
dotenv.config();

const connectedDb = async()=>{
    try{
        console.log("DATABASE");
        const connection = await mongoose.connect(process.env.MongoDb_URL);
        console.log("Connected Database...") ; 
    }catch(error){
        console.log(error);
    }
}
module.exports = connectedDb; 