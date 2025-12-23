const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");
const {s3, awsBucketName} = require("../middlewares/s3Upload");
const {DeleteObjectCommand} = require("@aws-sdk/client-s3");

const addPost = async (req, res) => {
    try{
        const {title, desc} = req.body;
        const {_id} = req.user;
        const file = req.file?.location || null;

        if(!title || !desc){
            return res.status(400).json({message: "All fields are required"});
        }

        const newPost = new Post({title, desc, file, createdBy: _id});
        await newPost.save();

        res.status(201).json({message: "Post created successfully"});
    }catch(error){
        return res.status(500).json({message: "Server Error", error: error.message});
    }
}

const updatePost = async (req, res) => {
    try{
        const {title, desc} = req.body;
        const {id} = req.params;
        const newFile = req.file?.location;

        const post = await Post.findById(id);
        if(!post){
            return res.status(404).json({message: "Post not found"});
        }

        if(newFile && post.file) {
            const oldKey = post.file.split("/").pop();
            const deleteParams = {
                Bucket: awsBucketName,
                Key: oldKey
            };
            await s3.send(new DeleteObjectCommand(deleteParams));
        }

        post.title = title || post.title;
        post.desc = desc || post.desc;
        post.file = newFile || post.file;

        await post.save();

        res.status(201).json({message: "Post updated successfully", post: post});
    }catch(error){
        return res.status(500).json({message: "Server Error", error: error.message});
    }
}

const deletePost = async (req, res) => {
    try{
        const {id} = req.params;
        const {_id: userId} = req.user;

        const post = await Post.findById(id);
        if(!post){
            return res.status(404).json({message: "Post not found"});
        }

        if(!post.createdBy.equals(userId)){
            return res.status(403).json({message: "You do not have permission to delete this post."});
        }

        const comments = await Comment.find({ post: id });
        const commentIds = comments.map(c => c._id);
        const commentedUserIds = comments.map(c => c.user); 

        await Comment.deleteMany({ _id: { $in: commentIds } });

        await User.updateMany(
            { _id: { $in: commentedUserIds } },
            { $pull: { commentedPosts: id } }
        );

        const likedUserIds = post.likes;

        await User.updateMany(
            { _id: { $in: likedUserIds } },
            { $pull: { likedPosts: id } }
        );

        if(post.file){
            const fileKey = post.file.split("/").pop();
            const deleteParams = {
                Bucket: awsBucketName,
                Key: fileKey
            };
            await s3.send(new DeleteObjectCommand(deleteParams));
        }

        await Post.findByIdAndDelete(id);

        res.status(201).json({message: "Post deleted successfully"});
    }catch(error){
        return res.status(500).json({message: "Server Error", error: error.message});
    }
}

const getPost = async (req, res) => {
    try{
        const {id} = req.params;

        const post = await Post.findById(id).populate("createdBy", "name").populate("likes", "name");
        if(!post){
            return res.status(404).json({message: "Post not found"});
        }

        const comments = await Comment.find({post: id}).populate("user", "name");
        const formattedComments = comments.map(comment => ({
            comment: comment.content,
            createdBy: comment.user.name,
            createdAt: new Date(comment.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        }));

        const likedUsers = post.likes.map(user => ({
            id: user._id,
            name: user.name,
        }));

        res.status(200).json({message: "Got post successfully", post: {
            title: post.title,
            description: post.desc,
            file: post.file,
            createdBy: post.createdBy.name,
            createdAt: new Date(post.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
            updatedAt: new Date(post.updatedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
            comments: {
                count: post.comments.length,
                list: formattedComments
            },
            likes:{
                count: post.likes.length,
                likedBy: likedUsers
            }
        }});
    }catch(error){
        return res.status(500).json({message: "Server Error", error: error.message});
    }
}

const getMyPosts = async (req, res) => {
    try {
        const {_id} = req.user;
        const posts = await Post.find({createdBy: _id})
            .populate("createdBy", "name profilePic")
            .populate("likes", "name")
            .populate({
                path: "comments",
                populate: {path: "user", select: "name"},
            });
        if(!posts || posts.length==0){
            return res.status(404).json({message: "You have not created any posts yet."});
        }
        
        const formattedPosts = posts.map((post) => {
            const formattedComments = post.comments.map(comment => ({
                comment: comment.content,
                createdBy: comment.user.name,
                createdAt: new Date(comment.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
            }));

            const likedUsers = post.likes.map(user => ({
                id: user._id,
                name: user.name,
            }));

            return {
                id: post._id,
                title: post.title,
                description: post.desc,
                file: post.file,
                createdBy: {
                    name: post.createdBy.name,
                    profilePic: post.createdBy.profilePic
                },
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                comments: {
                    count: post.comments.length,
                    list: formattedComments,
                },
                likes: {
                    count: post.likes.length,
                    likedBy: likedUsers,
                },
            };
        });

        res.status(200).json({message: "Got your posts successfully", posts: formattedPosts});
    }catch(error){
        return res.status(500).json({message: "Server Error", error: error.message});
    }
}

const getAllPosts = async (req, res) => {
    try{
        const posts = await Post.find()
            .populate("createdBy", "name profilePic")
            .populate("likes", "name")
            .populate({
                path: "comments",
                populate: {path: "user", select: "name"},
            });
        if(!posts || posts.length==0){
            return res.status(404).json({message: "Post not found"});
        }
        
        const formattedPosts = posts.map((post) => {
            const formattedComments = post.comments.map(comment => ({
                id: comment._id,
                comment: comment.content,
                createdBy: comment.user.name,
                createdAt: new Date(comment.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
            }));

            const likedUsers = post.likes.map(user => ({
                id: user._id,
                name: user.name,
            }));

            return {
                id: post._id,
                title: post.title,
                description: post.desc,
                file: post.file,
                createdBy: {
                    name: post.createdBy.name,
                    profilePic: post.createdBy.profilePic
                },
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                comments: {
                    count: post.comments.length,
                    list: formattedComments,
                },
                likes: {
                    count: post.likes.length,
                    likedBy: likedUsers,
                },
            };
        });

        res.status(200).json({message: "Got all posts successfully", posts: formattedPosts});
    }catch(error){
        return res.status(500).json({message: "Server Error", error: error.message});
    }
}

const addComment = async (req, res) => {
    try{
        const {content} = req.body;
        const {id: postId} = req.params;
        const {_id: userId} = req.user;
        
        if(!content || !postId){
            return res.status(400).json({message: "Both content and postId are required"});
        }
        
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({message: "Post not found"});
        }

        const loggedInUser = await User.findById(userId);
        if(!loggedInUser){
            return res.status(404).json({message: "User not found"});
        }

        const newComment = new Comment({post: postId, user: userId, content});
        await newComment.save();

        loggedInUser.commentedPosts.push(postId);
        await loggedInUser.save();

        post.comments.push(newComment._id);
        await post.save();

        res.status(201).json({message: "Comment created successfully", comment: newComment});
    }catch(error){
        return res.status(500).json({message: "Server Error", error: error.message});
    }
}

const deleteComment = async (req, res) => {
    try{
        const {id: commentId} = req.params;
        const {_id: userId} = req.user;
        
        const comment = await Comment.findById(commentId);
        if(!comment){
            return res.status(404).json({message: "Comment not found"});
        }
        
        if(!comment.user.equals(userId)){
            return res.status(403).json({message: "You do not have permission to delete this comment."});
        }

        const postId = comment.post;
        await Comment.findByIdAndDelete(commentId);
        await User.findByIdAndUpdate(userId, {$pull: {commentedPosts: postId}});
        await Post.findByIdAndUpdate(postId, {$pull: {comments: commentId}});

        res.status(200).json({ message: "Comment deleted successfully" });
    }catch(error){
        return res.status(500).json({message: "Server Error", error: error.message});
    }
}

const getComment = async (req, res) => {
    try{
        const {id} = req.params;
        
        const comment = await Comment.findById(id).populate("user", "name").populate("post", "title");
        if(!comment){
            return res.status(404).json({message:"Comment not found"});
        }

        res.status(200).json({message: "Got comment successfully", comment:{
            postTitle: comment.post.title,
            comment: comment.content,
            createdBy: comment.user.name,
            createdAt: new Date(comment.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        }});
    }catch(error){
        return res.status(500).json({message: "Server Error", error: error.message});
    }
}

const getMyComments = async (req, res) => {
    try{
        const {_id} = req.user;

        const comments = await Comment.find({user: _id}).populate("user", "name").populate("post", "title");
        if(!comments || comments.length==0){
            return res.status(404).json({message: "You have not commented on any posts yet"});
        }

        const formattedComments = comments.map(comment => ({
            postTitle: comment.post.title,
            comment: comment.content,
            createdBy: comment.user.name,
            createdAt: new Date(comment.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        }));

        res.status(200).json({message: "Got your comments successfully", comments: formattedComments});
    }catch(error){
        return res.status(500).json({message: "Server Error", error: error.message});
    }
}

const likeOrUnlikePost = async (req, res) => {
    try{
        const {id: postId} = req.params;
        const {_id: userId} = req.user;

        const post = await Post.findById(postId);
        const user = await User.findById(userId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if(post.likes.includes(userId)){
            post.likes.pull(userId);
            user.likedPosts.pull(postId);
        }else{
            post.likes.push(userId);
            user.likedPosts.push(postId);
        }

        await post.save();
        await user.save();

        res.status(200).json({
            message: "Like status updated",
            likesCount: post.likes.length,
            liked: post.likes.includes(userId)
        });
    }catch(error){
        return res.status(500).json({message: "Server Error", error: error.message});
    }
}

const getLikes = async (req, res) => {
    try{
        const {id: postId} = req.params;
        
        const post = await Post.findById(postId).populate("likes", "name profilePic");

        if(!post){
            return res.status(404).json({ message: "Post not found" });
        }

        const likedUsers = post.likes.map(user => ({
            id: user._id,
            name: user.name,
            profilePic: user.profilePic || null
        }));

        res.status(200).json({post: post.title, totalLikes: likedUsers.length, likes: likedUsers});
    }
    catch(error){
        return res.status(500).json({message: "Server Error", error: error.message});
    }
}

const getMyLikes = async (req, res) => {
    try{
        const {_id: userId} = req.user;

        const user = await User.findById(userId).populate("likedPosts", "title");

        const likedPosts = user.likedPosts.map(post => ({
            id: post.id,
            post: post.title
        }));

        res.status(200).json({totalLikedPosts: likedPosts.length, likedPosts: likedPosts});
    }
    catch(error){
        return res.status(500).json({message: "Server Error", error: error.message});
    }
}

const getLikeStatusForSinglePost = async (req, res) => {
    try{
        const {_id: userId} = req.user;
        const {id: postId} = req.params;

        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const isLiked = post.likes.includes(userId);

        res.status(200).json({LikeStatus: isLiked});
    }
    catch(error){
        return res.status(500).json({message: "Server Error", error: error.message});
    }
}

module.exports = {addPost, updatePost, deletePost, getPost, getAllPosts, getMyPosts, addComment, deleteComment, getComment, getMyComments, likeOrUnlikePost, getLikes, getMyLikes, getLikeStatusForSinglePost};