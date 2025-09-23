const express = require("express");
const {register, login, verifyCode, verifyUser, check, logout, profile, editProfile, sendForgotPasswordCode, setNewPassword} = require("../controllers/authController");
const router = express.Router();
const User = require("../models/User");
const {upload} = require("../middlewares/s3Upload");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", upload.single("profilePic"), register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/send-verification-email", verifyCode);
router.post("/verify-user", verifyUser);
router.post("/send-forgot-password-code", sendForgotPasswordCode);
router.post("/set-new-password", setNewPassword);
router.get("/check",authMiddleware, check);
router.get("/profile",authMiddleware, profile);
router.put("/edit-profile", authMiddleware, upload.single("file"), editProfile);

module.exports = router;