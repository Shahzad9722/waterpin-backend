const multer = require('multer');
const path = require('path');

const maxSize = 1 * 1024 * 1024;

var validateFile = function (file, cb) {
	allowedFileTypes = /jpeg|jpg|png/;
	const extension = allowedFileTypes.test(
		path.extname(file.originalname).toLowerCase()
	);
	const mimeType = allowedFileTypes.test(file.mimetype);
	if (extension && mimeType) {
		return cb(null, true);
	} else {
		return cb(
			new Error(
				'Invalid file type. Only JPEG, PNG and JPG file are allowed.'
			)
		);
	}
};

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, __basedir + '/uploads/');
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
	},
});

const upload = multer({
	storage: storage,
	fileFilter: function (req, file, callback) {
		validateFile(file, callback);
	},

	// limits: { fileSize: maxSize },
}).single('image');

module.exports = upload;
