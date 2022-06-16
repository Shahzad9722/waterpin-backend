const { matchedData, validationResult } = require('express-validator');
const User = require('../models/User');
const { resetEmail } = require('../mailer/reset');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
	sendEmailVerificationCode,
	sendPhoneVerificationCode,
	verifyPhoneVerificationCode,
	verifyEmailVerificationCode,
} = require('../utils/twilio');

const verifyResetToken = async (req, res, next) => {
	const errors = validationResult(req);
	//console.log(errors)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const validBody = matchedData(req, { locations: ['body'] });

	const { password } = validBody;

	const token = req.params['token'];

	const decodedJWT = jwt.verify(token, process.env.TOKEN_SECRET);

	if (decodedJWT.type !== 'verify') {
		return res.status(400).json({
			msg: 'Token invalid, please try with a proper reset token.',
		});
	}

	try {
		let user = await User.query()
			.findOne({ email: decodedJWT.email, id: decodedJWT.user_id })
			.then(user => {
				return user;
			});

		if (user) {
			const newPassword = await bcrypt.hash(password, 10).then(hash => {
				return hash;
			});

			user = await User.query()
				.update({ password: newPassword })
				.where('email', decodedJWT.email)
				.then(user => {
					return user;
				});
		} else {
			return res.status(400).json({
				msg: 'User not found for token given. Please try again with a valid token.',
			});
		}
		return res
			.status(200)
			.json({ user: user, success: 'Password changed successfully.' });
	} catch (error) {
		return res.status(200).json({
			msg: 'Password reset request has been recieved. If email exists on Waterpin, you will recieve a reset email.',
		});
	}

	//const user = await User.findOne({ account_number: decoded.account_number, _id: decoded._id });

	//user.password = await hashPassword(password);

	//user.save();

	return res.status(200).json({ msg: 'Good' });
};

const forgotPassword = async (req, res, next) => {
	const errors = validationResult(req);
	//console.log(errors)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const validBody = matchedData(req, { locations: ['body'] });

	const { email } = validBody;

	try {
		const user = await User.query()
			.findOne({ email: email })
			.then(user => {
				return user;
			});

		if (user) {
			resetEmail({
				email: user.email,
				user_id: user.id,
				firstNname: user.firstName,
			});
		}
		return res.status(200).json({
			msg: 'Password reset request has been recieved. If email exists on Waterpin, you will recieve a reset email.',
		});
	} catch (error) {
		return res.status(200).json({
			msg: 'Password reset request has been recieved. If email exists on Waterpin, you will recieve a reset email.',
		});
	}
};

const sendVerificationCode = async (req, res, next) => {
	const errors = validationResult(req);
	//console.log(errors)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const validBody = matchedData(req, { locations: ['body'] });

	const { user_id } = validBody;

	let user = await User.query()
		.findOne({ id: user_id })
		.then(user => {
			return user;
		});

	if (!user) {
		return res.status(400).json({
			msg: 'User not found. Please try again with a valid user_id.',
		});
	}

	try {
		let verificationData;
		if (user.email) {
			//Send Email Verification code
			verificationData = await sendEmailVerificationCode({
				email: user.email,
			});
		} else if (user.phoneNumber) {
			//Send Phone Verification code
			verificationData = await sendPhoneVerificationCode({
				phone: user.phoneNumber,
			});
		} else {
			return res.status(400).json({
				msg: 'User two step auth is not setup for this user.',
			});
		}
		if (verificationData) {
			return res.status(200).json(verificationData);
		} else {
			return res.status(400).json({
				msg: 'Veriifcation code could not be sent. Please try again with a valid phone number or email.',
			});
		}
	} catch (error) {
		return res
			.status(200)
			.json({ msg: 'Internal Server Error. Please contact support.' });
	}
};

const verifyVerification = async (req, res, next) => {
	const errors = validationResult(req);
	//console.log(errors)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const validBody = matchedData(req, { locations: ['body'] });

	const { user_id, code } = validBody;

	let user = await User.query()
		.findOne({ id: user_id })
		.then(user => {
			return user;
		});

	if (!user) {
		return res.status(400).json({
			msg: 'User not found. Please try again with a valid user_id.',
		});
	}
	try {
		let verifiedData;
		if (user.phoneNumber) {
      //Send Phone Verification code
      verifiedData = await verifyPhoneVerificationCode({
        phone: user.phoneNumber,
        code: code,
      });
		} else if (user.email) {
      //Send Email Verification code
			verifiedData = await verifyEmailVerificationCode({
				email: user.email,
				code: code,
			});
		} else {
			return res.status(400).json({
				msg: 'User two step auth is not setup for this user.',
			});
		}
		if (verifiedData) {
			if (verifiedData.status == 'approved') {
				return res.status(200).json({
					user: user,
					msg: 'Login successful! Redirecting you to dashboard...',
				});
			} else if (verifiedData.status == 'pending') {
				return res.status(500).json({
					success: false,
					msg: 'Invalid Authentication Code',
				});
			}
		}
	} catch (error) {
		console.log('error', error);
		return res.status(200).json({
			msg: 'Veriifcation code could not be sent. Internal Server Error. Please contact support.',
		});
	}
};

const toggletwoStep = async (req, res, next) => {
	const errors = validationResult(req);
	//console.log(errors)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const validBody = matchedData(req, { locations: ['body'] });

	const { user_id, isChecked } = validBody;

	let user = await User.query()
		.findOne({ id: user_id })
		.then(user => {
			return user;
		});

	if (!user) {
		return res.status(400).json({
			msg: 'User not found. Please try again with a valid user_id.',
		});
	}
	try {
		await User.query().findById(user_id).update({
			twoStepAuth: isChecked,
		});
		return res.status(200).json({ msg: 'Two Step Toggled..' });
	} catch (error) {
		return res.status(400).json({ msg: 'Something Went Wrong..' });
	}
};

module.exports = {
	verifyResetToken,
	forgotPassword,
	sendVerificationCode,
	verifyVerification,
	toggletwoStep,
};
