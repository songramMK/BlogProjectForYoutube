const jwt = require('jsonwebtoken') ; 
const dotenv = require('dotenv');
const { response } = require('../utils/response.utils');
const { validAccessToken } = require('../utils/token.utils');
dotenv.config() ; 

const authMiddleware = (req, res , next)=>{
    const AuthToken = req.cookies?.accessToken ; 
    if(!AuthToken){
        return next(response(res , 401 , "Authorization Token Missing, please login first" ) ); 
    }
    try{
        const decode = validAccessToken(AuthToken) ;
        req.user = decode ; 
        next() ; 
    }catch(error){
        console.log(error); 
        return response(res, 500 , "INTERNAL SERVER ERROR") ; 
    }

}

module.exports = authMiddleware