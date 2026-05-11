const multer = require('multer') ; 
const cloudinary = require('cloudinary').v2 ; 
const fs = require('fs'); 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const deleteFileToCloudinary = async(public_id) =>{
    try{
        await cloudinary.uploader.destroy(public_id) ; 
    }catch(error){
        console.log("Delete File To cloudinary: --> ",error);
    }
}

const uploadFileToCloudinary = async(file)=>{
    try{
        const option = {
            resource_type : file.mimetype.startsWith('video') ? "video" : "image"
        }
        return new Promise((resolve , reject)=>{
            const uploader  = file.mimetype.startsWith('video') ? cloudinary.uploader.upload_large : cloudinary.uploader.upload ; 
            uploader(file.path , option , (error , result )=>{
                fs.unlink(file.path , ()=>{}) ; 
                if(error){
                    return reject(error); 
                }
                resolve(result) ; 
            })
        })
    }catch(error){
        console.log(error) ; 
    }
}

const multerMiddleware = multer({dest : "uploads/"}).single('image') ; 

module.exports = {
  uploadFileToCloudinary,
  multerMiddleware,
  deleteFileToCloudinary,
};