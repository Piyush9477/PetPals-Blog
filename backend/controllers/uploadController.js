const {DeleteObjectCommand} = require("@aws-sdk/client-s3");
const {s3, awsBucketName} = require("../middlewares/s3Upload");

const uploadSingleFile = async (req, res) => {
    try{
        const fileUrl = req.file.location;
        res.status(200).json({ message: "File uploaded", fileUrl });
    }catch(error){
        res.status(500).json({ message: "Upload failed", error: error.message });
    }
}

const deleteFile = async (req, res) => {
    const {key} = req.query;

    if(!key){
        return res.status(400).json({message: "File key is required in query"});
    }

    const deleteParams = {
        Bucket: awsBucketName,
        Key: key
    };

    try{
        const command = new DeleteObjectCommand(deleteParams);
        await s3.send(command);
        res.status(200).json({message: "file deleted successfully"});
    }catch(error){
        return res.status(500).json({message: "File deletion failed", error: error.message});
    }
}

module.exports = {uploadSingleFile, deleteFile};