const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    title: {type: String, required: true},
    desc: String,
    file: String,
    createdBy: {type: mongoose.Types.ObjectId, ref: "user", required: true},
    comments: [{type: mongoose.Types.ObjectId, ref: "comment"}],
    likes: [{type: mongoose.Types.ObjectId, ref: "user"}]
}, {timestamps: true});

const Post = mongoose.model("post", postSchema);

module.exports = Post;