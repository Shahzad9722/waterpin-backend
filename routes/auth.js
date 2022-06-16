require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const { check, validationResult, matchedData } = require('express-validator');
const { sign } = require('jsonwebtoken');

require('../models/Auth');
const User = require('../models/User');
const UserNotificationSettings = require('../models/UserNotificationSettings');

const {
	verifyResetToken,
	forgotPassword,
	sendVerificationCode,
	verifyVerification,
	toggletwoStep,
} = require('../controllers/auth.controller');
const { createCustomer } = require('../utils/stripe-utils');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const {
	sendEmailVerificationCode,
	sendPhoneVerificationCode,
	verifyPhoneVerificationCode,
	verifyEmailVerificationCode,
} = require('../utils/twilio');

/**
 * @route POST /auth/login
 * @group Authentication
 * @param {Auth.model} login.body.required
 * @returns {AuthResponse.model} 200
 * @returns {object} 422 - Validation error
 * @returns {any} 401 - Unauthorized
 */
router.post(
	'/login',
	[
		check('email').optional({ nullable: true }),
		check('password').isLength({ min: 3 }),
		check('phoneNumber').optional({ nullable: true }),
	],
	async (req, res, next) => {
		const errors = validationResult(req);
            console.log(errors);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		const validBody = matchedData(req, { locations: ['body'] });

		const { email, phoneNumber } = validBody;

		if (email === undefined && phoneNumber === undefined) {
			return res
				.status(400)
				.json({ msg: 'email or phoneNumber cannot be blank fields.' });
		}

		try {
			let user = null;

			if (phoneNumber !== undefined) {
				user = await User.query()
					.findOne({phoneNumber:phoneNumber})
          .eager(
            '[role.[permissions], favorites ,notifications.[actor, type], payment_methods, rewards.[reward]]'
          )
					.first();

          console.log(user)
			} else {
				user = await User.query()
          .findOne({email:email})
          .eager(
            '[role.[permissions], favorites ,notifications.[actor, type], payment_methods, rewards.[reward]]'
          )
					.first();
			}

			if (user) {
				await bcrypt.compare(
					req.body.password,
					user.password,
					async (err, matched) => {
						if (matched) {
							const expire = 60 * 60 * 24;
							const token = sign(
								{ username: user.username, email: user.email },
								process.env.JWT_SECRET,
								{ expiresIn: expire }
							);

							delete user.password;
							//Verification Code On basis of twostep auth Flag
							if (user.twoStepAuth === true) {
								let verificationData;
								if (email) {
									//Send Email Verification code
									verificationData =
										await sendEmailVerificationCode({
											email: user.email,
										});
								} else if (phoneNumber) {
									//Send Phone Verification code
									verificationData =
										await sendPhoneVerificationCode({
											phone: user.phoneNumber,
										});
								} else {
									return res.status(400).json({
										msg: 'User two step auth is not setup for this user.',
									});
								}
								if (verificationData) {
									return res.status(200).json({
										user: user,
										token: token,
										expire_in: expire,
										msg: 'Authentication Code Sent Successfully...',
									});
								} else {
									return res.status(400).json({
										msg: 'Authentication code could not be sent. Please try again with a valid phone number or email.',
									});
								}
                // res.status(200).json({
                //   user: user,
                //   token: token,
                //   expire_in: expire,
                //   msg: 'Login successful! Redirecting you to dashboard...',
                // });
							} else {
								res.status(200).json({
									user: user,
									token: token,
									expire_in: expire,
									msg: 'Login successful! Redirecting you to dashboard...',
								});
							}
						} else {
							res.status(401).json({
								message: 'Invalid credentials',
							});
						}
					}
				);
			} else {
				res.status(401).json({
					message:
						'Email and password combination was invalid. Please try again.',
				});
			}
		} catch (error) {
			next(error);
		}
	}
);

/**
 * @route POST /auth/register/
 * @group Authentication
 * @param {User.model} user.body.required
 * @returns {AuthResponse.model} 200 - Create successfully
 * @returns {any} 401 - Unauthorized
 * @returns {object} 422 - Validation error
 * @returns {any} 500 - Internal error
 * @security None
 */
router.post(
	'/register',
	[
		check('username').optional({ nullable: true }),
		check('password')
			.isLength({ min: 6 })
			.custom((value, { req, loc, path }) => {
				if (value !== req.body.confirm_password) {
					throw new Error("Passwords don't match");
				} else {
					return value;
				}
			}),
		check('email').optional({ nullable: true }),
		check('firstName').isLength({ min: 3 }),
		check('lastName').isLength({ min: 3 }),
		check('phoneNumber').optional({ nullable: true }),
	],
	async (req, res, next) => {
		const errors = validationResult(req);
		console.log(errors);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const validBody = matchedData(req, { locations: ['body'] });

		const { email, phoneNumber, username } = validBody;

		if (email === undefined && phoneNumber === undefined) {
			return res
				.status(400)
				.json({ msg: 'email or phoneNumber cannot be blank fields.' });
		}

		if (username === undefined) {
			let randomNum = Math.round(Math.random() * 1000);
			let username = `${req.body.firstName}-${req.body.lastName}-${randomNum}`;
			req.body.username = username.toLowerCase();
		}

		delete req.body.confirm_password;

		await bcrypt
			.hash(req.body.password, 10)
			.then(hash => (req.body.password = hash));

		//Default role to basic user.
		req.body.role_id = 1;
		// req.body.display_name = `${req.body.first_name} ${req.body.last_name}`
		// req.body.rating = 0.00

		try {
			const newUser = await User.query()
				.insert(req.body)
				.eager('[role.[permissions]]')
				.then(user => {
					return user;
				});

			//const newStripeUser = await createCustomer({email:newUser.email, first_name:newUser.first_name, last_name:newUser.last_name})
			let pubnubID = newUser.username + '-pubnubID';
			let payload = {
				slug: newUser.username,
				status: 0,
				pubnubID: pubnubID,
			};

			const updatedUser = await User.query()
				.omit(['password'])
				.patchAndFetchById(newUser.id, payload)
				.then(user => {
					return user;
				});

			let notifPrefPayload = { user_id: updatedUser.id };

			const userNotificationsPreference =
				await UserNotificationSettings.query()
					.insert(notifPrefPayload)
					.then(settings => {
						return settings;
					});

			return res.status(200).json(updatedUser);
		} catch (error) {
			if (error.code === 'ER_DUP_ENTRY') {
				res.status(422).json({ errors: error });
			}

			next(error);
		}
	}
);

// router.post('/verify/:token', [
//   check('token').isLength({ min: 4 }),
//   check('password').isLength({ min: 6 }),
// ],verifyResetToken);

router.post('/reset', [check('email').isLength({ min: 4 })], forgotPassword);

router.post(
	'/verify/:token',
	[check('password').isLength({ min: 4 })],
	verifyResetToken
);

router.post(
	'/two-step-auth/',
	[check('user_id').isLength({ min: 1 })],
	sendVerificationCode
);

router.post(
	'/two-step-auth/verify',
	[check('user_id').isLength({ min: 1 }), check('code').isLength({ min: 3 })],
	verifyVerification
);

router.post(
	'/toggle-two-step',
	[
		check('user_id').isLength({ min: 1 }),
		check('isChecked').isLength({ min: 3 }),
	],
	toggletwoStep
);
//Two Step Auth On Login Verification
router.post(
	'/login/two-step-auth/verify',
	[check('user_id').isLength({ min: 1 }), check('code').isLength({ min: 3 })],
	verifyVerification
);

module.exports = router;
