const { uploadFileToCloudinary } = require("../config/cloudinary.config");
const UserModel = require("../model/user.model");
const errorHandler = require("../utils/error.utils");
const { HashPasswordGenerate } = require("../utils/hashPassword.utils");
const response = require('../utils/response.utils');

const updateUser = async(req,res ,next)=>{
    try{

        console.log("req.user.userId:" , req.user.userId ); 
        console.log("req.params.userId:" ,req.params.userId ) ; 

        console.log(req.user.userId) ; 
        console.log(req.params.userId);


        console.log(typeof req.user.userId) ; 
        console.log(typeof req.params.userId); 

        if(req.user.userId !== req.params.userId ){
            return next(errorHandler(403 , "You Cant Update This Profile... Your are not valid user ")) ; 
        }

        const updateUser = {} ; 
      
        /*
        profilePicture , 
        userName , 
        password 
        */

        if(req.body.userName ){
            if(req.body.userName.length <3 || req.body.userName.length >16 ){
                return next(errorHandler(400 , "UserName Must Be between 3 to 16 characters"));
            }
            if(req.body.userName.includes(" ")){
                return next(errorHandler(400 , "UserName cant contain space"))
            }
            if(req.body.userName  !== req.body.userName.toLowerCase()){
                return next(errorHandler(400 ,"UserName Can't Contain LowerCase " ))
            }
            if(req.body.userName != req.body.userName.match(/^[a-zA-Z0-9]+$/)){
                return next(errorHandler(400 , "UserName can Only Contain Letters And Numbers"))
            }
            updateUser.userName = req.body.userName 
        }
        if(req.body.password){
            const ExistUser = await UserModel.findById(req.params.userId) ; 
            if(!ExistUser){
                return next(errorHandler(400 , "User Not Exist"))
            }
            ExistUser.password = req.body.password ; 
            await ExistUser.save() ; 

            // updateUser.password = await HashPasswordGenerate(req.body.password);
        }
        if(req.file){
            const ProfilePictureUrl = await uploadFileToCloudinary(req.file);
            updateUser.profilePictrue = ProfilePictureUrl?.secure_url ; 

        }

        const UpdateUser = await UserModel.findByIdAndUpdate(
            req.params.userId , 
            {
                $set : updateUser 
            }, 
            {new : true }
        )
           
            const safeUser = {
              _id: UpdateUser._id,
              userName: UpdateUser.userName,
              email: UpdateUser.email,
              profilePictrue: UpdateUser.profilePictrue,
            };

    
      
        return response(res, 200, "Update User Successfully", safeUser); 
        

        
    }catch(error){
        next(error) ; 
    }
}
const deleteUser = async(req,res , next)=>{
    try {
        if(req.user.userId !== req.params.userId){
            return next(errorHandler(403 , "You Cant Delete This User Because You are not valid User")) ; 
        }
        await UserModel.findByIdAndDelete(req.params.userId) ; 
        return response(res, 200 , "USER DELETED SUCCESSFULLY") ; 
    } catch (error) {
      next(error);
    }
}
const signOut = async(req,res,next)=>{
    try {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken") ; 

        return response(res, 200 , "USER SIGNOUT SUCCESSFULLY") ; 
    } catch (error) {
      next(error);
    }
}
module.exports = {signOut , updateUser , deleteUser} ; 