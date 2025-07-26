const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true, trim: true},
    password: {type: String, required: true, minlength: 6},
    role: {type: String, enum: ["Admin", "User"], default: "User"},
    profilePic: String,
    verificationCode: String,
    forgotPasswordCode: String,
    isVerified: {type: Boolean, default: false}
}, {timestamps: true});

const User = mongoose.model("user", userSchema);
module.exports = User;