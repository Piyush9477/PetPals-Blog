const express = require("express");
const router = express.Router();
const {upload} = require("../middlewares/s3Upload");
const authMiddleware = require("../middlewares/authMiddleware");
const {uploadSingleFile, deleteFile} = require("../controllers/uploadController");

router.post("/single", authMiddleware, upload.single("file"), uploadSingleFile);
router.delete("/delete", authMiddleware, deleteFile);

module.exports = router;