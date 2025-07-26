const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const {awsAccessKey, awsSecretAccessKey, awsBucketName, awsRegion} = require("../config/keys");

const s3 = new S3Client({
    region: awsRegion,
    credentials: {
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretAccessKey
    },
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: awsBucketName,
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            const fileName = Date.now().toString() + "-" + file.originalname;
            cb(null, fileName);
        },
    }),
});

module.exports = {upload, s3, awsBucketName};

