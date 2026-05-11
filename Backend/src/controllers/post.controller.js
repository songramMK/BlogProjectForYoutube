const {
  uploadFileToCloudinary,
  deleteFileToCloudinary,
} = require("../config/cloudinary.config");
const postModel = require("../model/poster.model");
const errorHandler = require("../utils/error.utils");
const response = require("../utils/response.utils");

const CreatePost = async (req, res, next) => {
  try {
    if (req.user.userId !== req.params.userId) {
      return next(errorHandler(401, "Invalid User"));
    }

    const { title, category, content } = req.body;
    if (
      !title ||
      !category ||
      !content ||
      title.trim() === "" ||
      category.trim() === "" ||
      content.trim() === ""
    ) {
      return next(errorHandler(400, "All Fields Required"));
    }
    if (!req.file) {
      return next(errorHandler(400, "Poster Image Must Be Required"));
    }

    const slug = title
      .split(" ")
      .join("")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");
    const posterImage = await uploadFileToCloudinary(req.file);
    const PosterImage = posterImage?.secure_url;
    const posterImagePublicId = posterImage?.public_id

    

    const NewPost = await postModel.create({
      ...req.body,
      userId: req.params.userId,
      slug,
      PosterImage,
      posterImagePublicId,
    });

    return response(res, 201, "BLOG POST CREATED SUCCESSFULLY...", NewPost);
  } catch (error) {
    next(error);
  }
};
const UpdatePost = async (req, res, next) => {
  try {
    if (req.user.userId !== req.params.userId) {
      return next(errorHandler(401, "Invalid User"));
    }

    const ExistPost = await postModel.findById(req.params.postId) ; 
    if(!ExistPost){
        return next(errorHandler(400 , "POST NOT EXIST"))
    }
    let updatePost = {

    }; 

    console.log("ExistedPostUserId:"); 
    console.log("req.params.userId");
    console.log(ExistPost.userId);
    console.log(typeof ExistPost.userId.toString()); 
    console.log(req.params.userId);
    const ExistPostUserId = ExistPost.userId.toString() ; 
    if (ExistPostUserId !== req.params.userId) {
      return next(errorHandler(403, "YOU CANT UPDATE THIS POST"));
    }
  
    console.log("title") ; 

    if (req.body.title) {
      if (req.body.title.length <= 2) {
        return next(errorHandler(400, "Title Must Be Greater Than 2 "));
      }
      updatePost.title = req.body.title;
      updatePost.slug = req.body.title
        .split(" ")
        .join("")
        .replace(/[^a-zA-Z0-9-]/g, "");
    }
    console.log("content");
    if (req.body.content) {
      updatePost.content = req.body.content;
    }
    if (req.body.category) {
      updatePost.category = req.body.category;
    }
    console.log("file")
    if (req.file) {

        if (ExistPost.posterImagePublicId) {
          await deleteFileToCloudinary(ExistPost.posterImagePublicId);
        }
      console.log("deletFile") ; 
      const ProfileLink = await uploadFileToCloudinary(req.file);
      updatePost.PosterImage = ProfileLink.secure_url;
      console.log("secureUrl") ; 
    }
    const UpdateUser = await postModel.findByIdAndUpdate(
      req.params.postId,
      {
        $set: updatePost,
      },
      { new: true },
    );
    console.log("UPDATE USER");

    return response(res, 200, "UPDATE POST SUCCESSFULLY", UpdateUser);
  } catch (error) {
    next(error);
  }
};
const DeletePost = async (req, res, next) => {
  try {
       if (req.user.userId !== req.params.userId) {
         return next(errorHandler(401, "Invalid User"));
       }

       const ExistPost = await postModel.findById(req.params.postId);
       if (!ExistPost) {
         return next(errorHandler(400, "POST NOT EXIST"));
       }
       const ExistPostUserId = ExistPost.userId.toString() ; 
       if (ExistPostUserId !== req.params.userId) {
         return next(errorHandler(403, "YOU CANT UPDATE THIS POST"));
       }
  

    await postModel.findByIdAndDelete(req.params.postId);
    return response(res, 200, "POST DELETED SUCCESSFULLY");
  } catch (error) {
    next(error);
  }
};
const GetPost = async (req, res, next) => {
  try {
    const startIndex = req.query.startIndex || 0;
    const limit = req.query.limit || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const SearchPost = await postModel
      .find({
        ...(req.query.postId && { postId: req.query.postId }),
        ...(req.query.userId && { userId: req.query.userId }),
        ...(req.query.category && { category: req.query.category }),
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.searchTerm && {
          $or: [
            { title: { $regex: req.query.searchTerm, $options: "i" } },
            { content: { $regex: req.query.searchTerm, $options: "i" } },
          ],
        }),
      })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const TotalPostCount = await postModel.countDocuments();
    const now = new Date();
    const OneMonthAge = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
    );

    const OneMonthAgoPostCount = await postModel.countDocuments({
      createdAt: { $gt: OneMonthAge },
    });

    return response(res, 200, "Search Successfully", {
      SearchPost,
      TotalPostCount,
      OneMonthAgoPostCount,
    });
  } catch (error) {
    next(error);
  }
};
const ContentImage = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

module.exports = { CreatePost, UpdatePost, GetPost, DeletePost, ContentImage };
