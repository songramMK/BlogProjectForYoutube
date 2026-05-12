const commentModel = require("../model/comment.model");
const postModel = require("../model/poster.model");
const errorHandler = require("../utils/error.utils");
const  response  = require("../utils/response.utils");


const createComment = async (req, res, next) => {
  try {
    const { content, parentCommentId } = req.body;
    if (!content || content.trim() === "") {
      return next(errorHandler(400, "Post Does Not Exist"));
    }
    const postId = req.params.postId;
    const ExistPost = await postModel.findById(postId);
    if (!ExistPost) {
      return next(errorHandler(400, "Post Does Not Exist"));
    }

    const newComment = await commentModel.create({
      postId,
      userId: req.user.userId,
      content,
      parentCommentId: parentCommentId || null ,
    });

    return response(res, 201, "comment Created Successfully", newComment);
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const ExistPost = await postModel.findById(postId);
    if (!ExistPost) {
      return next(errorHandler(400, "Post Does Not Exist"));
    }

    const { commentId  , content} = req.body;
    console.log("CommentId : " , commentId); 
    const ExistComment = await commentModel.findById(commentId);
    if (!ExistComment) {
      return next(errorHandler(400, "Comment Not Found"));
    }
    if (!content || content.trim() === "") {
      return next(errorHandler(400, "Content Required"));
    }
    const UpdateContent = {} ; 
    UpdateContent.content = content;
    console.log("ExistComment-for-update: " , ExistComment);

    const userId = req.user.userId;
    if (userId !== ExistComment.userId.toString()) {
      return next(errorHandler(403, "You Cant Delete This Comment"));
    }
    console.log("UserId" , userId) ; 

    const UpdateComment = await commentModel.findByIdAndUpdate(
      commentId,
      {
        $set:  UpdateContent ,
      },
      { new: true },
    ); ; 

    return response(res, 200 , "Comment Update Successfully" , UpdateComment) ; 
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
 
    const postId = req.params.postId;
    console.log('postId' , postId); 
    const ExistPost = await postModel.findById(postId);
    if (!ExistPost) {
        return next(errorHandler(404, "Post Does Not Exist"));
    }
    console.log("Exist POst ", ExistPost) ; 
    const { commentId } = req.body;
    console.log('commentId', commentId); 

    const ExistComment = await commentModel.findById(commentId);
    if (!ExistComment) {
        return response(400, "Comment Not Found");
    }
    console.log('ExistComment' , ExistComment);

    const userId = req.user.userId;
    console.log("userId" , userId) ; 
    if (userId !== ExistComment.userId.toString()) {
      return next(errorHandler(403, "You Cant Delete This Comment"));
    }

    await commentModel.findByIdAndDelete(commentId);
    return response(res, 200, "Comment Deleted Successfully");
  } catch (error) {
    next(error);
  }
};
const fetchComment = async (req, res, next) => {
  try {
    const postId = req.params.postId ; 
     const ExistPost = await postModel.findById(postId);
     if (!ExistPost) {
       return next(errorHandler(400, "Post Does Not Exist"));
     }

     const page = parseInt(req.params.page) || 1 ; 
     const limit = 10 ; 
     const skip = (page -1 ) * limit ; 

 
     const Comments = await commentModel
       .find({
         postId,
         parentCommentId: null,
       })
       .populate("userId", "userName profilePictrue")
       .sort({ createdAt: -1 })
       .skip(skip)
       .limit(limit); 


    //    Reply
    const threadComment = await Promise.all(
        Comments.map(async(ReplyComment)=>{
            return {
              ...ReplyComment._doc,
              Replies: await getReply(ReplyComment._id),
            };
        })
    )

    const totalComent = await commentModel.countDocuments() ; 
    return response(res, 200 , "Fetch Comment Successfully" , {
        totalComent , 
        comments : threadComment 

    })
  } catch (error) {
    next(error);
  }
};

const getReply = async(ParentCommentId)=>{
    try{
        const ReplyComment = await commentModel
          .find({ parentCommentId: ParentCommentId })
          .populate("userId", "userName profilePictrue");
          
        
        const nestedComment = await Promise.all(ReplyComment.map(async(Reply)=>{
            return {
              ...Reply._doc,
              Replies : await getReply(Reply._id)
            };
        }));
        
        return nestedComment; 
        
    }catch(error){
        next(error); 
    }
}

module.exports = { fetchComment, deleteComment, createComment, updateComment };
