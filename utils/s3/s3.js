const aws = require('aws-sdk');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const s3 = new aws.S3({
	secretAccessKey: process.env.AWS_S3_ACCESS_SECRET,
	accessKeyId: process.env.AWS_S3_ACCESS_KEY,
	region: process.env.AWS_S3_PRIVATE_REGION,
});

exports.uploadFile = file => {
	const filepath = file.path;
	console.log(filepath);
	const fileStream = fs.createReadStream(filepath);

	const uploadParams = {
		Bucket: process.env.AWS_S3_PUBLIC,
		Body: fileStream,
		Key: `destinations/${uuidv4()}`,
		ContentType: file.mimetype,
		ACL: 'public-read',
	};

	return s3.upload(uploadParams).promise();
};
