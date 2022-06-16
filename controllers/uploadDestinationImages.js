const { uploadFile } = require('../utils/s3/s3');
const Destination = require('../models/Destinations');
let upload = require('../config/image_multer.config');
//const sharp = require('sharp');
const path = require('path');

exports.uploadImage = async (req, res) => {
	try {
		upload(req, res, async error => {
			if (error) {
				let msg = null;
				if (error.message) msg = error.message;
				else msg = error;
				return res.status(400).json({
					success: false,
					message: msg,
				});
			} else {
				if (req.file == undefined) {
					return res.status(404).json({
						success: false,
						message: 'Please Upload a File',
					});
				} else {
					const id = req.params.id;
					if (!id) {
						const temp = {
							success: false,
							message: 'Please Provide a valid id',
						};
						res.json(temp);
					}
					//Find By Id
					const destination = await Destination.query().findById(id);
					if (!destination) {
						const temp = {
							success: false,
							message: `Nothing Found With this Id ${id}`,
						};
						res.json(temp);
					}
					//get uploadedFile
					const file = req.file;
					if (!file) {
						const temp = {
							success: false,
							message: 'Please Upload a File',
						};
						res.json(temp);
					}
					console.log(file);

					// await sharp(file.path)
					// 	.resize(1000, 800)
					// 	.jpeg({ quality: 90 })
					// 	.toFile(path.resolve(file.destination, 'resized.jpg'));
					//
					// let xyz = path
					// 	.resolve(__basedir + '/uploads/resized.jpg')
					// 	.toString();

					let obj = {
						path: file.path,
						mimetype: 'image/jpeg',
					};

					console.log('image', obj);

					const result = await uploadFile(obj);
					const resultLocation = result.Location;
					const destinationImageUpdate =
						await Destination.query().updateAndFetchById(id, {
							destination_image: resultLocation,
						});
					if (!destinationImageUpdate) {
						const temp = {
							success: false,
							message: 'Uploading UnSuccessful',
						};
						res.json(temp);
					}
					const temp = {
						success: true,
						message: 'Destination Image updated successfully',
					};
					res.json(temp);
				}
			}
		});
	} catch (error) {
		const temp = {
			success: false,
			message: error.message,
		};
		res.json(temp);
	}
};
