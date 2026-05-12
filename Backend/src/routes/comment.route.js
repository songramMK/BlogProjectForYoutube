const express =require('express') ; 
const authMiddleware = require('../middleware/authMiddleware.middleware');
const { createComment, updateComment, deleteComment, fetchComment } = require('../controllers/comment.controler');
const commentRouter = express.Router() ; 

commentRouter.post("/createcomment/:postId", authMiddleware, createComment); 
commentRouter.put("/updatecomment/:postId", authMiddleware, updateComment); 
commentRouter.delete("/deletecomment/:postId", authMiddleware, deleteComment);
commentRouter.get("/fetchcomment/:postId/:page", authMiddleware, fetchComment);


module.exports = commentRouter ; 