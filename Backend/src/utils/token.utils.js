const jwt = require('jsonwebtoken') ; 
const AccessTokenGenerate = (payload)=>{
    return jwt.sign(payload, process.env.ACCESS_SECRET_KEY, {
      expiresIn: process.env.ACESS_TOKEN_TIME,
    });
}
const RefreshTokenGenerate = (payload)=>{
    return jwt.sign(payload, process.env.REFRESS_SECRET_KEY, {
      expiresIn: process.env.REFRES_TOKEN_TIME,
    });
}
const validRefreshToken = (refresToken)=>{
    return jwt.verify(refresToken, process.env.REFRESS_SECRET_KEY);
}
const validAccessToken = (Accesstoken)=>{
    return jwt.verify(Accesstoken, process.env.ACCESS_SECRET_KEY);
}

const getCookiepayload = ()=>{
    const cookiePayload = {
        httpOnly : true , 
        secure : false , 
        sameSite : "lax" ,
        maxAge : parseInt(process.env.MAX_AGE) * 24 * 60 * 60 * 1000 ,
    }
    return cookiePayload ; 

}

module.exports = {AccessTokenGenerate, getCookiepayload,RefreshTokenGenerate , validAccessToken , validRefreshToken}; 