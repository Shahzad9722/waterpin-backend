const { matchedData, validationResult } = require('express-validator');
const User = require('../models/User');
const UserNotificationSettings = require('../models/UserNotificationSettings');
const UserInvites = require('../models/UserInvites');

const Bookings = require('../models/Bookings');

const Notifications = require('../models/Notifications');
const ListingFavorites = require('../models/ListingFavorites');
const { checkNewRewards } = require('../utils/points');
const { PointsTrigger } = require('./pointsTrigger.conroller')
const { v4: uuidv4 } = require('uuid');
const { raw } = require('objection');
const {
	createAccountLink,
	createConnectLoginLink,
	createConnectSeller,
	createPortalLink,
	retrieveSellerAccount,
	deleteConnectSeller,
	deleteCustomer,
	createSellerSubscription,
} = require('../utils/stripe-utils');

const {
	sendInviteSMS,
} = require('../utils/twilio');

const {
	sendEmailInvite,
} = require('../mailer/core');


const bcrypt = require('bcrypt');

const getDashboard = async (req, res, next) => {
	let id = parseInt(req.user.id);
	try {
		const rewardsCheck = await checkNewRewards({ user_id: id });

		const user = await User.query()
			.omit(['password'])
			.eager(
				'[role.[permissions], notifications.[actor, type], bookings.[listing],favorites.[listing], payment_methods, reviews_recieved.[renter], reviews_sent, notification_preference, listings, invites, rewards.[reward]]'
			)
			.findById(id);

		if (user) {
			if (user.is_owner === true) {
				//const acct = await retrieveSellerAccount({account:user.stripe_connect_id})
				//let payload = {...user, stripe_owner_data:acct}
				res.status(200).json({ user: user, dashboard: null });
			} else {
				res.status(200).json({ user: user, dashboard: null });
			}
		} else {
			res.status(200).send({
				error: 'User not found. Please try again with a valid id.',
			}); // 204: No content
		}
	} catch (error) {
		next(error);
	}
};

const userInfo = async (req, res, next) => {
	let id = parseInt(req.user.id);
	try {
		const user = await User.query()
			.omit(['password'])
			.eager(
				'[role.[permissions], notifications.[actor, type], payment_methods, notification_preference, invites, rewards.[reward]]'
			)
			.findById(id);

		if (user) {
			if (user.is_owner === true) {
				const acct = await retrieveSellerAccount({
					account: user.stripeConnectID,
				});
				let payload = { ...user, stripe_owner_data: acct };
				res.status(200).json(user);
			} else {
				res.status(200).json(user);
			}
		} else {
			res.status(200).send({
				error: 'User not found. Please try again with a valid id.',
			}); // 204: No content
		}
	} catch (error) {
		next(error);
	}
};

const userNotifications = async (req, res, next) => {
	let id = parseInt(req.user.id);
	try {
		const notifications = await Notifications.query()
			.where('user_id', '=', id)
			.eager('[actor, type]')
			.then(notifs => {
				return notifs;
			});

		if (notifications) {
			res.status(200).json(notifications);
		} else {
			res.status(200).send({
				error: 'User not found. Please try again with a valid id.',
			}); // 204: No content
		}
	} catch (error) {
		next(error);
	}
};

const clearNotifications = async (req, res, next) => {
	let id = parseInt(req.user.id);
	try {
		const notifications = await Notifications.query()
			.where(builder =>
				builder
					.where('user_id', '=', id)
					.andWhere('is_read', '=', false)
			)
			.update({ is_read: true })
			.then(notifs => {
				return notifs;
			});

		const notificationsList = await Notifications.query()
			.where('user_id', '=', id)
			.eager('[actor, type]')
			.then(notifs => {
				return notifs;
			});

		if (notificationsList) {
			res.status(200).json(notificationsList);
		} else {
			res.status(200).send({
				error: 'User not found. Please try again with a valid id.',
			}); // 204: No content
		}
	} catch (error) {
		next(error);
	}
};

const updateNotificationSettings = async (req, res, next) => {
	let id = parseInt(req.user.id);

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const validBody = matchedData(req, { locations: ['body'] });

	const { user_notification_setting_id, user_id } = validBody;

	try {
		//Update user with updated socials.
		const updatedSettings = await UserNotificationSettings.query()
			.patchAndFetchById(user_notification_setting_id, validBody)
			.then(settings => {
				return settings;
			});

		return res.status(200).json(updatedSettings);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'A server error has occurred, please try again later or contact support.',
		});
		///next(error);
	}
};

const userInfoBySlug = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const validParams = matchedData(req, { locations: ['params'] });

	const { slug } = validParams;

	let id = parseInt(req.user.id);
	try {
		let user = await User.query()
			.findOne({ slug: slug })
			.omit(['password', 'phoneNumber'])
			.then(user => {
				return user;
			});

		if (user) {
			let response = { ...user };
			res.status(200).json(response);
		} else {
			res.status(200).send({
				error: 'User not found. Please try again with a valid id.',
			}); // 204: No content
		}
	} catch (error) {
		next(error);
	}
};

const userInfoById = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const validParams = matchedData(req, { locations: ['params'] });

	const { id } = validParams;

	try {
		let user = await User.query()
			.findOne({ id: id })
			.omit(['password', 'phone_number'])
			.then(user => {
				return user;
			});

		if (user) {
			let response = { ...user };
			res.status(200).json(response);
		} else {
			res.status(500).send({
				error: 'User not found. Please try again with a valid id.',
			}); // 204: No content
		}
	} catch (error) {
		next(error);
	}
};

const updateUserInfo = async (req, res, next) => {
	let id = parseInt(req.user.id);

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const validBody = matchedData(req, { locations: ['body'] });

	const { first_name, last_name, email, username, phone_number, dob } =
		validBody;

	try {
		//Update user with updated socials.
		const updatedUser = await User.query()
			.omit(['password'])
			.eager(
				'[role.[permissions], notifications.[actor, type], payment_methods, rewards.[reward]]'
			)
			.patchAndFetchById(id, validBody)
			.then(user => {
				return user;
			});

		return res.status(200).json(updatedUser);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'A server error has occurred, please try again later or contact support.',
		});
		///next(error);
	}
};

const updateProfilePicture = async (req, res, next) => {
	let id = parseInt(req.user.id);

	const { size, mimetype, key, bucket, location } = req.file;

	let update = {
		profileImage: location,
	};

	try {
		//Update user with updated socials.
		const updatedUser = await User.query()
			.omit(['password'])
			.patchAndFetchById(id, update)
			.then(user => {
				return user;
			});

		return res.status(200).json(updatedUser);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'A server error has occurred, please try again later or contact support.',
		});
		///next(error);
	}
};

const getBillingInfo = async (req, res, next) => {
	let id = parseInt(req.user.id);

	try {
		const user = await User.query()
			.omit(['password'])
			.eager('[role.[permissions]]')
			.findById(id);

		if (user) {
			const portal = await createPortalLink({
				account: user.stripeID,
				return_url: 'http://localhost:3000/account',
			});
			res.status(200).json(portal);
		} else {
			res.status(200).send({
				error: 'User not found. Please try again with a valid id.',
			}); // 204: No content
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'A server error has occurred, please try again later or contact support.',
		});
	}
};

const getSellerPortal = async (req, res, next) => {
	let id = parseInt(req.user.id);

	try {
		const user = await User.query()
			.omit(['password'])
			.eager('[role.[permissions]]')
			.findById(id);

		if (user) {
			if (user.is_creator === false) {
				return res.status(400).json({
					msg: 'you must be a creator to perform this action.',
				});
			}
			const sellerSetupLink = await createConnectLoginLink({
				account: user.stripeConnectID,
			});
			res.status(200).json(sellerSetupLink);
		} else {
			res.status(200).send({
				error: 'User not found. Please try again with a valid id.',
			}); // 204: No content
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'A server error has occurred, please try again later or contact support.',
		});
	}
};

const getSellerPortalOnboarding = async (req, res, next) => {
	let id = parseInt(req.user.id);

	try {
		const user = await User.query()
			.omit(['password'])
			.eager('[role.[permissions]]')
			.findById(id);

		if (user) {
			if (user.is_creator === false) {
				return res.status(400).json({
					msg: 'you must be a creator to perform this action.',
				});
			}
			const sellerSetupLink = await createAccountLink({
				account: user.stripeConnectID,
				refresh_url: 'http://localhost:3001/account',
				return_url: 'http://localhost:3000/account',
				type: 'account_onboarding',
			});
			res.status(200).json(sellerSetupLink);
		} else {
			res.status(200).send({
				error: 'User not found. Please try again with a valid id.',
			}); // 204: No content
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'A server error has occurred, please try again later or contact support.',
		});
	}
};

const updatePassword = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const validBody = matchedData(req, { locations: ['body'] });

	const { old_pw, new_pw, confirm_new_pw } = validBody;

	let id = parseInt(req.user.id);

	try {
		const user = await User.query()
			.eager('[role.[permissions]]')
			.findById(id);

		if (user) {
			const confirmed = await bcrypt.compare(old_pw, user.password);
			if (confirmed) {
				const newP = await bcrypt.hash(new_pw, 10).then(hash => {
					return hash;
				});
				//Update user with updated socials.
				const updatedUser = await User.query()
					.findOne({
						id: id,
					})
					.update({ password: newP })
					.then(user => {
						return user;
					});

				return res.status(200).json(updatedUser);
			} else {
				return res
					.status(400)
					.send({ error: 'Passwords does not match.' }); // 204: No content
			}
		} else {
			return res.status(200).send({
				error: 'User not found. Please try again with a valid id.',
			}); // 204: No content
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'A server error has occurred, please try again later or contact support.',
		});
	}
};

const updateEmail = async (req, res, next) => {};

const deactivateAccount = async (req, res, next) => {
	let id = parseInt(req.user.id);

	try {
		let user = await User.query()
			.omit(['password'])
			.eager('[role.[permissions]]')
			.findById(id);

		if (user) {
			const updatedUser = await User.query()
				.findOne({
					id: id,
				})
				.update({ status: 2 });

			if (user.is_creator === true) {
				const deletion = await deleteConnectSeller({
					stripeSellerID: user.stripeSellerID,
				});
			} else {
				const deletion = await deleteCustomer({
					stripeID: user.stripeID,
				});
			}

			return res
				.status(200)
				.send({ msg: 'Successful deactivation of account.' });
		} else {
			return res.status(200).send({
				error: 'User not found. Please try again with a valid id.',
			}); // 204: No content
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'A server error has occurred, please try again later or contact support.',
		});
	}
};

/**
FAVORITES
**/

const addFavoriteListing = async (req, res, next) => {
	let user_id = parseInt(req.user.id);

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const validBody = matchedData(req, { locations: ['body'] });

	const { listing_id } = validBody;

	try {
		const payload = { user_id: user_id, listing_id: listing_id };

		const newFav = await ListingFavorites.query()
			.insert(payload)
			.then(listing => {
				return listing;
			});

		if (newFav) {
			return res.status(200).json(newFav);
		} else {
			return res
				.status(404)
				.json({ msg: 'Listing favorite could not be created.' });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'A server error has occurred, please try again later or contact support.',
		});
		///next(error);
	}
};

const deleteFavoriteListing = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const validBody = matchedData(req, { locations: ['body'] });

	const { id } = validBody;

	try {
		const deletedFav = await ListingFavorites.query()
			.findOne({ id: id })
			.delete();

		if (deletedFav) {
			return res.status(200).json(deletedFav);
		} else {
			return res.status(404).json({
				msg: 'Listing favorites could not be found with this ID.',
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'A server error has occurred, please try again later or contact support.',
		});
		///next(error);
	}
};

const getFavoriteListingsByUserId = async (req, res, next) => {

	let user_id = parseInt(req.user.id);


	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const favs = await ListingFavorites.query()
			.where('user_id', '=', user_id)
			.then(fav => {
				return fav;
			});

			console.log(favs)

		if (favs) {
			return res.status(200).json(favs);
		} else {
			return res.status(404).json({
				msg: 'Listing favorites could not be found with this user ID.',
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'A server error has occurred, please try again later or contact support.',
		});
		///next(error);
	}
};

const getUserTrips = async (req, res, next) => {
	let user_id = parseInt(req.user.id);

	try {
		const allTrips = await Bookings.query()
			.where('renter_user_id', '=', user_id)
			.eager('[owner, listing]')
			.then(trips => {
				return trips;
			});

		if (allTrips) {
			return res.status(200).json(allTrips);
		} else {
			return res
				.status(404)
				.json({ msg: 'Trips could not be found with this user ID.' });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'A server error has occurred, please try again later or contact support.',
		});
		///next(error);
	}
};

const getOwnerBookings = async (req, res, next) => {
	let user_id = parseInt(req.user.id);

	try {
		const allBookings = await Bookings.query()
			.where('owner_id', '=', user_id)
			.eager('[renter, listing]')
			.then(bookings => {
				return bookings;
			});

		if (allBookings) {
			return res.status(200).json(allBookings);
		} else {
			return res.status(404).json({
				msg: 'Bookings could not be found with this user ID.',
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'A server error has occurred, please try again later or contact support.',
		});
		///next(error);
	}
};

/**
Invitations
**/

const sendInvitiation = async (req, res, next) => {

  let user_id = parseInt(req.user.id);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

	const validBody = matchedData(req, { locations: ['body'] });

  const { inviteEmail, invitePhone, isEmail } = validBody;

  try {

    let existingInvite = null

    if (isEmail === true) {
      existingInvite = await UserInvites
          .query()
          .findOne({invited_friend_email:inviteEmail, status:2})
          .then(invite => {return invite})
    }else{
      existingInvite = await UserInvites
          .query()
          .findOne({invited_friend_phoneNumber:invitePhone, status:2})
          .then(invite => {return invite})
    }


    if (existingInvite) {
      return res.status(404).json({msg:"Invite made already."})
    }

    let payload = null;

    if (isEmail === true) {
      payload = {
        user_id:user_id,
        invited_friend_email:inviteEmail,
        status:0,
      }
    }else{
      payload = {
        user_id:user_id,
        invited_friend_phoneNumber:invitePhone,
        status:0,
      }
    }

    const newInvite = await UserInvites
        .query()
        .insert(payload)
        .then(newInv => {return newInv})

    if (newInvite) {

      if (isEmail === true) {
        const emailInvite = sendEmailInvite({recipient_email:inviteEmail, referrer_id: req.user.id, inviter:`${req.user.firstName} ${req.user.lastName}`})
      }else{
        const smsInvite = sendInviteSMS({phone_number:invitePhone, referrer_id: req.user.id, inviter:`${req.user.firstName} ${req.user.lastName}`})
		}
		
		
		//await sendInvitationTrigger(req.user, '');
		await PointsTrigger(req.user, 'invite-friends');
		
      return res.status(200).json(newInvite)
    }else{
      return res.status(404).json({msg:"Invitation could not be created in database."})
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({msg:"A server error has occurred, please try again later or contact support."})
    ///next(error);
  }
};

module.exports = {
	getDashboard,
	userInfo,
	updateNotificationSettings,
	userInfoBySlug,
	updateUserInfo,
	updatePassword,
	updateEmail,
	updateProfilePicture,
	getBillingInfo,
	getSellerPortal,
	getSellerPortalOnboarding,
	deactivateAccount,
	userNotifications,
	clearNotifications,
	deleteFavoriteListing,
	getFavoriteListingsByUserId,
	addFavoriteListing,
	getUserTrips,
	getOwnerBookings,
  	sendInvitiation
};
