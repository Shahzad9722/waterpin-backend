const multer = require("multer");
const path = require("path");

var validateFile = function (file, cb) {
  allowedFileTypes = /xlsx|csv/;
  const extension = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  if (extension) {
    return cb(null, true);
  } else {
    cb("Invalid file type. Only XLSX and CSV file are allowed.");
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    validateFile(file, callback);
  },
}).single("file");

module.exports = upload;
