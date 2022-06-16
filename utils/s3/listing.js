const multer = require("multer");
const path = require("path");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const { v4: uuidv4 } = require("uuid");

const acceptedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-ms-wmv",
  "video/avi",
  "video/msvideo",
];

const s3 = new aws.S3({
  secretAccessKey: process.env.AWS_S3_ACCESS_SECRET,
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  region: process.env.AWS_S3_PRIVATE_REGION,
});

const filter = (req, file, cb) => {
  if (acceptedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "File type not supported (please use .jpeg, .png, .mp4, .mov, .avi or .wmv)"
      ),
      false
    );
  }
};

const storage = multerS3({
  acl: "public-read",
  s3,
  bucket: process.env.AWS_S3_PUBLIC,
  cacheControl: "max-age=31536000",
  contentType: function (req, file, cb) {
    cb(null, file.mimetype);
  },
  serverSideEncryption: "AES256",
  key: function (req, file, cb) {
    console.log(file);
    cb(null, "/listings/" + req.body.listing_name + "/" + file.originalname);
  },
});

const deleteUpload = (key) => {
  try {
    s3.deleteObject(
      {
        Bucket: process.env.AWS_S3_PRIVATE,
        Key: key,
      },
      function (err, data) {}
    );
  } catch (e) {
    console.log(e);
  }
};

const listingUpload = multer({
  filter,
  storage,
  limits: { fieldSize: 25 * 1024 * 1024 },
});

module.exports = { listingUpload, deleteUpload };
