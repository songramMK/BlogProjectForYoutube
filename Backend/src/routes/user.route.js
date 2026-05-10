const express = require('express'); 
const authMiddleware = require('../middleware/authMiddleware.middleware');
const { updateUser, deleteUser, signOut } = require('../controllers/user.controller');
const { multerMiddleware } = require('../config/cloudinary.config');
const userRouter = express.Router() ; 
userRouter.post('/updateUser/:userId' , multerMiddleware  ,authMiddleware , updateUser); 
userRouter.delete('/delete/:userId' , authMiddleware , deleteUser) ; 
userRouter.post('/signOut' , authMiddleware , signOut) ; 

module.exports = userRouter ; 