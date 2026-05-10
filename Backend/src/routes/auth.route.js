const express = require('express') ; 
const { signUp, signIn, SendOtp, verifyOtp, resetPassword } = require('../controllers/auth.controller');
const AuthRouter = express.Router() ; 

AuthRouter.post('/signUp' , signUp) ; 
AuthRouter.post("/signIn" , signIn) ; 
AuthRouter.post('/forgetPassWord' , SendOtp) ; 
AuthRouter.post('/verifyOtp' , verifyOtp) ; 
AuthRouter.post('/resetPassword' , resetPassword) ; 

module.exports = AuthRouter; 