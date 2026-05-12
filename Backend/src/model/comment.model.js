const mongoose = require('mongoose') ; 
const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    numberOfLikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comments",
      default : null 
    },
  },
  { timestamps: true },
); ; 
const commentModel = mongoose.model('comments'  , commentSchema) ; 

module.exports = commentModel ; 