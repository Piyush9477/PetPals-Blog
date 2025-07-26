const express = require("express");
const {register, login, verifyCode, verifyUser, logout} = require("../controllers/authController");
const router = express.Router();
const User = require("../models/User");
const {upload} = require("../middlewares/s3Upload");

router.post("/register", upload.single("profilePic"), register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/send-verification-email", verifyCode);
router.post("/verify-user", verifyUser);

module.exports = router;