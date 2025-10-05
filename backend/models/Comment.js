const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    post: {type: mongoose.Types.ObjectId, ref: "post", required: true},
    user: {type: mongoose.Types.ObjectId, ref: "user", required: true},
    content: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
});

const Comment = mongoose.model("comment", commentSchema);
module.exports = Comment;