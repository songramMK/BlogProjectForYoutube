const mongoose = require('mongoose') ; 
const HashPasswordGenerate = require('../utils/hashPassword.utils');
const userSchema = new mongoose.Schema({
    userName : {
        type : String ,
        required : true 
    }, 
    email : {
        type : String , 
        required : true , 
        unique : true 
    }, 
    password : {
        type : String , 
        select : false ,
        minLength : [6 , "Password Atleast 6 character present"] , 
        maxLength : [18 , "Password at most 16 character present"] , 
        required : true , 
    }, 
    profilePicture : {
        type : String , 
        default : "" , 
    }, 
    // OTP PART START
    Otp : {
        type : String , 
    }, 
    otpExpire : {
        type : Date , 
    }, 
    isOtpVerified : {
        type : Boolean ,
        default : false  
    }, 
    // OTP END 

    refreshToken : [
        {
            token : {
                type : String , 
                required : true 
            }, 
            expireAt : {
                type : Date , 
                required : true 
            }, 
            createdAt : {
                type : Date , 
                default : Date.now() 
            }
        }
    ]
} , { timestamps : true }) ; 

userSchema.pre("save" , async function(){
    try{
        if(!this.isModified("password")){
            return next() ; 
        }
        this.password = await HashPasswordGenerate(this.password) ; 
        next() ; 
    }catch(error)
    {
        console.log(error) ; 
    }
})

const UserModel = mongoose.model("users" , userSchema) ; 
module.exports = UserModel; 