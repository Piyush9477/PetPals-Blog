const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {addPost, updatePost, deletePost, getPost, getAllPosts, getMyPosts, addComment, deleteComment, getComment, getMyComments, likeOrUnlikePost, getLikes, getMyLikes, getLikeStatusForSinglePost} = require("../controllers/postController");
const {upload} = require("../middlewares/s3Upload");

router.post("/add", authMiddleware, upload.single("file"), addPost); // add post
router.put("/update/:id", authMiddleware, upload.single("file"), updatePost); // update post
router.delete("/delete/:id", authMiddleware, deletePost); // delete post
router.get("/get/:id", authMiddleware, getPost); // get single post
router.get("/get", getAllPosts); // get all posts
router.get("/my-posts/get", authMiddleware, getMyPosts); // get user created posts
router.post("/add-comment/:id", authMiddleware, addComment); // add comment
router.delete("/delete-comment/:id", authMiddleware, deleteComment); // delete comment
router.get("/get-comment/:id", authMiddleware, getComment); // get single comment
router.get("/get-my-comments", authMiddleware, getMyComments); // get user comments
router.put("/like/:id", authMiddleware, likeOrUnlikePost); // like or unlike a post
router.get("/get-likes/:id", authMiddleware, getLikes); // get likes for a single post
router.get("/get-my-likes", authMiddleware, getMyLikes); // get user liked posts
router.get("/get-like-status-for-single-post/:id", authMiddleware, getLikeStatusForSinglePost); // get like status for a single post

module.exports = router;