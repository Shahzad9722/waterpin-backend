const express = require('express');
const router = express.Router();
const { getDashboard, userInfo, getUserTrips, getOwnerBookings, getSellerPortal, getSellerPortalOnboarding, userInfoBySlug, updateNotificationSettings, forgotPassword, updateUserInfo, updatePassword, updateEmail, updateProfilePicture, getBillingInfo, userNotifications, clearNotifications, getFavoriteListingsByUserId,  deleteFavoriteListing, addFavoriteListing, sendInvitiation} = require( '../../controllers/user.controller');
const { check } = require('express-validator');


/**
 * @route GET /user/profile
 * @group User
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/', userInfo);


/**
 * @route GET /user/profile
 * @group User
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/dashboard', getDashboard);

/**
 * @route GET /user/profile
 * @group User
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/portal/seller', getSellerPortal);


/**
 * @route GET /user/profile
 * @group User
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/portal/seller/onboarding', getSellerPortalOnboarding);

/**
 * @route GET /user/profile
 * @group User
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/notifications', userNotifications);

/**
 * @route GET /user/profile
 * @group User
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.post('/notifications/clear', clearNotifications);

/**
 * @route GET /user/profile/portal
 * @group User
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/portal', getBillingInfo);

/**
 * @route GET /user/profile/slug
 * @group User
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/profile/:slug', [check('slug').exists()],userInfoBySlug);

/**
 * @route PATCH /user/profile
 * @group User
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.patch('/', [
  check('firstName').optional({nullable: true}),
  check('lastName').optional({nullable: true}),
  check('email').optional({nullable: true}),
  check('phoneNumber').optional({nullable: true}),
  check('dob').optional({nullable: true}),
  check('gender').optional({nullable: true}),
  check('address1').optional({nullable: true}),
  check('address2').optional({nullable: true}),
  check('emergencyContactName').optional({nullable: true}),
  check('emergencyContactNo').optional({nullable: true}),
  check('facebookUserId').optional({nullable: true}),
  check('googleUserId').optional({nullable: true}),
  check('googleSignup').optional({nullable: true}),
  check('facebookSignup').optional({nullable: true}),
  check('appleSignup').optional({nullable: true}),
  check('twoStepAuth').optional({nullable: true}),
], updateUserInfo);


/**
 * @route PATCH /user/profile/update/email
 * @group User
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.patch('/notifications/settings',[
  check('user_notification_setting_id').exists(),
  check('user_id').exists(),
  check('upcoming_trips_notifications').exists(),
  check('unsubscribe_marketing_emails').exists(),
  check('reminders_tips_notifications').exists(),
  check('messages_notifications').exists(),
  check('leave_review_notifications').exists(),
  check('important_messages_news_announcement_notifications').exists(),
  check('get_review_notifications').exists(),
  check('discount_special_credit_notifications').exists(),
  check('cancelations_notifications').exists(),
  check('booking_expire_notifications').exists(),

], updateNotificationSettings);



/**
 * @route PATCH /user/profile/update/avatar
 * @group User
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */

//router.patch('/update/avatar', [profileUpload.single('file')], updateProfilePicture);

/**
 * @route PATCH /user/profile/update/password
 * @group User
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.post('/update/password',[
  check('old_pw').isLength({ min: 4 }),
  check('new_pw').isLength({ min: 6 }),
  check('confirm_new_pw').isLength({ min: 6 })
], updatePassword);


/**
 * @route PATCH /user/profile/update/email
 * @group User
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.patch('/update/email', updateEmail);


/**
 * @route POST /user/profile/favorites/
 * @group User
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/favorites/', getFavoriteListingsByUserId);

/**
 * @route POST /user/profile/trips/
 * @group User
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/trips/all/', getUserTrips);


/**
 * @route POST /user/profile/trips/owner
 * @group User
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/trips/owner/', getOwnerBookings);





/**
 * @route POST /user/profile/favorites/
 * @group User
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.post('/favorites/', [
  check('listing_id'),
],addFavoriteListing);


/**
 * @route POST /user/profile/favorites/
 * @group User
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.delete('/favorites/', [
  check('listing_id'),
],deleteFavoriteListing);



/**
 * @route POST /user/profile/invite/
 * @group User
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.post('/invite/', [
  check('isEmail').exists(),
  check('invitePhone').optional({nullable: true}),
  check('inviteEmail').optional({nullable: true})
],sendInvitiation);



module.exports = router;
