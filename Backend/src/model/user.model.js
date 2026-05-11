const mongoose = require('mongoose') ; 
const {HashPasswordGenerate} = require('../utils/hashPassword.utils');
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique : [true , "USERNAME MUST BE UNIQUE"] ,
      required: [true , "USERNAME MUST BE REQUIRED"],
    },
    email: {
      type: String,
      required: [true , "EMIL MUST BE REQUIRED"],
      unique: [true , "Email Must Be Unique"],
    },
    password: {
      type: String,
      select: false,
      minLength: [6, "Password Atleast 6 character present"],
      maxLength: [18, "Password at most 16 character present"],
      required: true,
    },
    profilePictrue: {
      type: String,
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    profilePicturePublicId : {
      type : String , 
      default : null 
    } , 
  
    // OTP PART START
    Otp: {
      type: String,
      default : null , 
    },
    otpExpire: {
      type: Date,
      default : null , 
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
    // OTP END

    refreshToken: [
      {
        token: {
          type: String,
          required: true,
        },
        expireAt: {
          type: Date,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  { timestamps: true },
); ; 

userSchema.pre("save" , async function(next){
    try{
        if(!this.isModified("password")){
            return next ;
        }
        const HashPassword  = await HashPasswordGenerate(this.password) ; 
        console.log(HashPassword) ; 
        this.password = HashPassword; 
        next ; 

    }catch(error)
    {
        console.log(error) ; 
        next(error);
    }
})

const UserModel = mongoose.model("users" , userSchema) ; 
module.exports = UserModel; 