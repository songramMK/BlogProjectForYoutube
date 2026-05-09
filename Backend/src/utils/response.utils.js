const response = (res, statusCode , message , data = null )=>{
    if(!res){
        return ; 
    }
    const DataObject = {
        statusCode , 
        status : statusCode <= 400 ? "success" : "error" , 
        message , 
        data
    }
    return res.status(statusCode).json(DataObject);
}
module.exports = response ; 