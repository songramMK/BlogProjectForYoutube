const express =require('express') ; 
const authMiddleware = require('../middleware/authMiddleware.middleware');
const { multerMiddleware } = require('../config/cloudinary.config');
const { CreatePost, GetPost, UpdatePost, DeletePost } = require('../controllers/post.controller');


const PostRouter = express.Router() ; 


PostRouter.post('/createpost/:userId' ,multerMiddleware , authMiddleware , CreatePost) ; 
PostRouter.get('/getpost', authMiddleware, GetPost); 
PostRouter.put('/updatepost/:postId/:userId' , multerMiddleware, authMiddleware , UpdatePost) ; 
PostRouter.delete('/deletepost/:postId/:userId' , authMiddleware,DeletePost) ; 

module.exports = PostRouter ; 