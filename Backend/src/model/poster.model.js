const mongoose = require('mongoose') ; 
const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title Must Be Needed"],
    },
    category: {
      type: String,
      required: [true, "Category Must Be Needed"],
    },
    content: {
      type: String,
      required: [true, "Content Must Be Needed"],
    },
    PosterImage : {
        type : String , 
        required : true 
    }, 
    posterImagePublicId : {
        type : String , 
        required : true 
    },
    slug : {
        type : String , 
        required : true , 
    } , 
    numberOfViews : {
        type : Number 
    }, 
    likes: [
        {
            type : mongoose.Schema.Types.ObjectId , 
            ref : "users"
        }
    ]
  },
  { timestamps: true },
); ; 
const postModel = mongoose.model("posts" , postSchema) ; 
module.exports = postModel; 