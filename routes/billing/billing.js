const express = require('express');
const router = express.Router();
const { getStripeDetails, paymentIntent, createStripeUser, makeStripeCharge, createOwnerPayoutInfo, getOwnerPayoutInfo, paymentMethodIntent} = require( '../../controllers/billing.controller');
const { query, check} = require('express-validator');
/**
 * @route POST /billing/
 * @group Billing
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.post('/',[
  check('userId').isInt(),
], getStripeDetails);


/**
 * @route POST /billing/create-stripe-user/
 * @group Billing
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.post('/create-stripe-card', [
  check('payment_method_id').exists(),
  check('userId').exists(),
], createStripeUser);



/**
 * @route POST /billing/create-stripe-user/
 * @group Billing
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.post('/payment-intent', [
  check('amount').exists(),
], paymentIntent);




/**
 * @route POST /billing/charge/
 * @group Billing
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.post('/charge',[
  check('id').isInt(),
  check('pmId').exists(),
  check('user_id').isInt(),
  check('paymentIntentID').exists(),
  check('startDate').exists(),
  check('endDate').exists(),
  check('startTime').exists(),
  check('endTime').exists(),
  check('guest_capacity').exists(),
  check('duration').exists(),
], makeStripeCharge);


/**
 * @route POST /billing/create-owner-bank-info/
 * @group Billing
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.post('/create-owner-bank-info',[
  check('account_number').isLength({ min: 8 }),
  check('routing_number').isLength({ min: 8 }),
  check('firstName').isLength({ min: 3 }),
  check('lastName').isLength({ min: 3 }),
  check('type').exists(),
  check('address_1').isLength({ min: 3 }),
  check('address_2').optional({nullable: true}),
  check('city').isLength({ min: 3 }),
  check('state_province').isLength({ min: 3 }),
  check('country').isLength({ min: 3 }),
  check('postal_code').isLength({ min: 3 }),
  check('poBox').optional({nullable: true}),
  check('business_name').optional({nullable: true}),
  check('phone_number').isLength({ min: 3 }),
  check('last4SSN').isLength({ min: 4 }),
  check('dob').isLength({ min: 4 }),
  check('userId').isInt(),
], createOwnerPayoutInfo);

/**
 * @route GET /billing/get-owner-bank-info/
 * @group Billing
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.post('/get-owner-bank-info',[
  check('userId').isInt(),
], getOwnerPayoutInfo);


/**
 * @route GET /billing/add-pm-method-intent/
 * @group Billing
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/add-pm-method-intent', paymentMethodIntent);





module.exports = router;
