const  response  = require("../utils/response.utils");
const UserModel = require("../model/user.model");
const {
  AccessTokenGenerate,
  RefreshTokenGenerate,
  getCookiepayload,
} = require("../utils/token.utils");
const errorHandler = require("../utils/error.utils");
const otpGenerate = require("../utils/otpGenerate.utils");
const {SendOtpFunction} = require('../utils/email.utils');
const { CompareHashPasword } = require('../utils/hashPassword.utils');

const signUp = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;
    if (
      !userName ||
      !email ||
      !password ||
      userName.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
            return next(errorHandler(400, "All Fields Reqired"));

    }
    const UserExist = await UserModel.findOne({ email });
    if (UserExist) {
            return next(errorHandler(400, "USER ALREADY EXIST ... LOGIN NOW"));

    }

    const newUser = new UserModel({
      userName,
      email,
      password,
    });

    await newUser.save();

    const payload = {
      userId: newUser._id,
      email: newUser.email,
    };

    const AccessToken = AccessTokenGenerate({ userId: newUser._id });
    const RefreshToken = RefreshTokenGenerate(payload);
    const GetCookiePayload = getCookiepayload();

    res.cookie("accessToken", AccessToken, GetCookiePayload);
    res.cookie("refreshToken", RefreshToken, GetCookiePayload);

    await UserModel.findByIdAndUpdate(newUser._id, {
      $push: {
        
          refreshToken: {
            $each : [
              {

                token: RefreshToken,
                expireAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              }
            ], 
            $slice : -5 
          },
          
        
        
      },
    });
    const safeUser = {
      _id: newUser._id,
      userName: newUser.userName,
      email: newUser.email,
      profilePictrue: newUser.profilePictrue,
    };

    return response(res, 201, "User Created SuccessFully", safeUser);
  } catch (error) {
    next(error);
  }
};
const signIn = async (req, res, next) => {
  try {
    const {email , password} = req.body ; 
    if(!email || !password || email.trim() === "" || password.trim() === ""){
      return next(errorHandler(400 , "All Fields Required"));
    }
    const UserExist = await UserModel.findOne({email}).select("+password") ; 
    if(!UserExist){
      return next(errorHandler(400, "USER DOES NOT EXIST ... SIGNUP NOW"));

    }

    const ValidPassword = await CompareHashPasword(password , UserExist.password) ; 
    if(!ValidPassword){
  
      return next(errorHandler(400, "INVALID USER"));

    }

    
    const payload = {
      userId: UserExist._id,
      email: UserExist.email,
    };

    const RefreshToken =  RefreshTokenGenerate(payload) ; 
    const AccesToken = AccessTokenGenerate({ userId: UserExist._id }); ; 
    const GetCookiePayload = getCookiepayload() ;
    


    res.cookie("accessToken", AccesToken, GetCookiePayload);
    res.cookie("refreshToken", RefreshToken, GetCookiePayload);

    await UserModel.findByIdAndUpdate(UserExist._id , {
        $push : {
            refreshToken : {
              $each : [
                {
                  token : RefreshToken , 
                  expireAt : new Date(Date.now() + 7 * 24 * 60 * 60 *1000)

                }
              ], 
              $slice : -5 
            }
        }
    })

        const safeUser = {
          _id: UserExist._id,
          userName: UserExist.userName,
          email: UserExist.email,
          profilePictrue: UserExist.profilePictrue,
        };

    return response(res, 200 , "SignIn SuccessFully" , safeUser);


} catch (error) {
    next(error);
  }
};
const SendOtp = async (req, res, next) => {
  try {
    const {email} = req.body; 
    if(!email || email.trim() === ""){
      return next(errorHandler(400, "EMAIL NOT EXIST")) ; 
    }
    const userExist = await UserModel.findOne({email }) ; 
    if(!userExist){
      return next(errorHandler(400 , "USER DOES NOT EXIST... SIGNUP FIRST")) ;
    }
    const GENERATED_OTP = otpGenerate() ; 
    userExist.Otp = GENERATED_OTP; 
    userExist.otpExpire = new Date(Date.now() + 5 * 60 * 1000) ; 
    await userExist.save() ; 

    await SendOtpFunction(email , GENERATED_OTP) ; 

    return response(res, 200 , "OTP SEND YOUR Emil SUCCESSFULLY ... check your email") ; 


  } catch (error) {
    next(error);
  }
};
const verifyOtp = async (req, res, next) => {
  try {

    const {email , otp} = req.body ; 
    if(!email || email.trim() === "" ||!otp || otp.trim() === ""){
      return next(errorHandler(400 , "All Fields Required")) ;
    }

    const UserExist = await UserModel.findOne({email}) ; 
    if(!UserExist){
      return next(errorHandler(400 , "USER does not exist ... please signup first")) ;
    }

    if(UserExist.Otp !== otp){
      return next(errorHandler(401 , "INVALID OTP")) ; 
    }
    // 8:30 
    // 8:35 
    // 8:32
    if(UserExist.otpExpire <  Date.now()){
      return next(errorHandler(401 , "Time Expired")) ;
    }
  
    UserExist.isOtpVerified = true ; 
    UserExist.Otp = null ; 
    UserExist.otpExpire = null ; 

    await UserExist.save() ; 

    return response( res,200 , "OTP VERIFIED SUCCESSFULLY...") ; 


  } catch (error) {
    next(error);
  }
};
const resetPassword = async (req, res, next) => {
  try {
    /*
    forgetpassword btn click 
    otp generate page -> otp 
    resetpassword 

    */
   const {email , NewPassword} = req.body ; 
   if(!email || !NewPassword || email.trim() === ""  || NewPassword.trim() === ""){
    return next(errorHandler(200 , "ALL FIELDS REQUIRED")) ; 
   }
      const UserExist = await UserModel.findOne({ email });
      if (!UserExist) {
        return next(
          errorHandler(400, "USER does not exist ... please signup first"),
        );
      }
      if(!UserExist.isOtpVerified){
        return next(errorHandler(401 , "INVALID USER"));
      }
      UserExist.password = NewPassword ; 
      UserExist.isOtpVerified = false ; 
      await UserExist.save() ; 

      return response(res, 200 , "PASSWORD RESET SUCCESSFULLY...") ; 

  } catch (error) {
    next(error);
  }
};
const google = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
const github = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
module.exports = {
  github,
  google,
  resetPassword,
  SendOtp,
  verifyOtp,
  signIn,
  signUp,
};
