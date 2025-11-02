const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {addPost, updatePost, deletePost, getPost, getAllPosts, getMyPosts, addComment, deleteComment, getComment, getMyComments, likeOrUnlikePost, getLikes, getMyLikes} = require("../controllers/postController");
const {upload} = require("../middlewares/s3Upload");

router.post("/add", authMiddleware, upload.single("file"), addPost);
router.put("/update/:id", authMiddleware, upload.single("file"), updatePost);
router.delete("/delete/:id", authMiddleware, deletePost);
router.get("/get/:id", authMiddleware, getPost);
router.get("/get", getAllPosts);
router.get("/my-posts/get", authMiddleware, getMyPosts);
router.post("/add-comment/:id", authMiddleware, addComment);
router.delete("/delete-comment/:id", authMiddleware, deleteComment);
router.get("/get-comment/:id", authMiddleware, getComment);
router.get("/get-my-comments", authMiddleware, getMyComments);
router.put("/like/:id", authMiddleware, likeOrUnlikePost);
router.get("/get-likes/:id", authMiddleware, getLikes);
router.get("/get-my-likes", authMiddleware, getMyLikes);

module.exports = router;