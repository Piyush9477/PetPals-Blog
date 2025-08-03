const express = require("express");
const {register, login, verifyCode, verifyUser, check, logout} = require("../controllers/authController");
const router = express.Router();
const User = require("../models/User");
const {upload} = require("../middlewares/s3Upload");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", upload.single("profilePic"), register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/send-verification-email", verifyCode);
router.post("/verify-user", verifyUser);
router.get("/check",authMiddleware, check);

module.exports = router;