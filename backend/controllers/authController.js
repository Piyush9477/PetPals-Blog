const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Post = require("../models/Post");
const {jwtsecret} = require("../config/keys");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const {generateCode} = require("../utils/generateCode");
const {s3, awsBucketName} = require("../middlewares/s3Upload");
const {DeleteObjectCommand} = require("@aws-sdk/client-s3");

const register = async (req, res) => {
    const {name, email, password, role} = req.body;
    const profilePic = req.file?.location || null;

    if(!name || !email || !password){
        return res.status(400).json({message: "All fields are required"});
    }

    let user = await User.findOne({email});
    if (user){
        return res.status(400).json({message: "User already exists"});
    }

    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({name, email, password: hashedPassword, role, profilePic});
        await user.save();

        res.status(201).json({message: "User registered successfully"});
    }catch(error){
        return res.status(500).json({message: "Server Error", error: error.message});
    }
}

const login = async (req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({message: "Email and password are required"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "User not found"});
        }
        if(!user.isVerified){
            return res.status(403).json({ message: "Please verify your email before logging in." });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            return res.status(400).json({message: "Incorrect password"});
        }

        const token = jwt.sign({id: user._id, role: user.role}, jwtsecret, {expiresIn: "1d"});
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict"
        });

        res.status(200).json({message: "Login Successful", user: {
            token: token,
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePic: user.profilePic,
            isVerified: user.isVerified
        }});
    }catch(error){
        return res.status(500).json({message: "Server Error", error: error.message});
    }
}

const verifyCode = async (req, res) => {
    try{
        const {email} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        if(user.isVerified){
            return res.status(400).json({message: "User is already verified"});
        }

        const code = generateCode();

        user.verificationCode = code;
        await user.save();

        //send email
        await sendEmail({
            emailTo: user.email,
            subject: "Email verification code",
            code,
            content: "verify your account"
        });

        res.status(200).json({message: "User verification code sent successfully"});
    }catch(error){
        return res.status(500).json({message: "Server Error", error: error.message});
    }
}

const verifyUser = async (req, res) => {
    try{
        const {email, code} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        if(user.verificationCode !== code){
            return res.status(400).json({message: "Incorrect code"});
        }

        user.isVerified = true;
        user.verificationCode = null;
        await user.save();

        res.status(200).json({message: "User verified successfully"});
    }catch(error){
        return res.status(500).json({message: "Server Error", error: error.message});
    }
}

const check = (req, res) => {
    try{
        res.status(200).json({ user: req.user });
    }catch(error){
        return res.status(500).json({message: "Server Error", error: error.message});
    }
}

const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict"
    });
    res.status(200).json({message: "Logged out successfully"});
}

const profile = async (req, res) => {
    try{
        const postCount = await Post.countDocuments({createdBy: req.user._id});
        return res.status(200).json({
            user: req.user,
            postsCount: postCount
        });
    }catch(error){
        return res.status(500).json({message: "Server Error", error: error.message});
    }
}

const editProfile = async (req, res) => {
    try{
        const {name, profilePic} = req.body;
        const newProfilePic = req.file?.location;

        const user = await User.findById(req.user._id);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        if(newProfilePic && user.profilePic) {
            const oldKey = user.profilePic.split("/").pop();
            const deleteParams = {
                Bucket: awsBucketName,
                Key: oldKey
            };
            await s3.send(new DeleteObjectCommand(deleteParams));
        }

        user.name = name || user.name;
        user.profilePic = newProfilePic || user.profilePic;

        await user.save();

        res.status(201).json({message: "Profile updated successfully", user: user});
    }catch(error){
        return res.status(500).json({message: "Server Error", error: error.message});
    }
}

module.exports = {register, login, verifyCode, verifyUser, check, logout, profile, editProfile};