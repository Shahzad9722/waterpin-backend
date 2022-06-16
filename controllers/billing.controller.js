const { matchedData, validationResult } = require('express-validator');
const User = require('../models/User');
const StripeProfile = require('../models/StripeProfile');
const BookingChargeHistory = require('../models/BookingChargeHistory');
const OwnerBankInformation = require('../models/OwnerBankInformation');
const Bookings = require('../models/Bookings');
const Listing = require('../models/Listing');


const { raw } = require('objection');
const { v4: uuidv4 } = require("uuid");
const { calculateListingPricing, confirmPaymentIntent, createPaymentIntent, retrieveCardSource, retrievePaymentMethod, createCharge, createCustomer, createCardToken, createCardSource, createConnectSeller, retrieveSellerAccount, deleteConnectSeller, deleteCustomer, setupPaymentMethodIntent } = require('../utils/stripe-utils');

const makeStripeCharge = async (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validBody = matchedData(req, { locations: ['body'] });

  const { paymentIntentID, pmId, user_id, id, guest_capacity, duration} = validBody;

  try {


    let existingListing = await Listing
        .query()
        .findOne({listing_id:id})
        .then(listing => {return listing})


    if (!existingListing) {
      res.status(404).json({ Error: "No listing found with this id." });
    }


    const stripeUserDetails = await StripeProfile
      .query()
      .findOne({user_id:user_id, cardId:pmId})
      .then(stripe => {return stripe});

    if (!stripeUserDetails) {
      res.status(404).json({ Error: "No card information created for this user and card profile." });
    }

    let confirmedPaymentIntent =  await confirmPaymentIntent({pmId:stripeUserDetails.cardId, paymentIntentID:paymentIntentID})

    console.log(confirmedPaymentIntent)


    const bookingPayload = {
      renter_user_id:user_id,
      owner_id:existingListing.user_id,
      list_id:existingListing.id,
      booking_duration:JSON.stringify(duration),
      booking_guests:guest_capacity,
      booking_times:JSON.stringify({startTime:startTime, endTime:endTime}),
      booking_date_from:startDate,
      booking_date_to:endDate }


    const newBooking = await Bookings
        .query()
        .insert(bookingPayload)
        .then(booking => {return booking})

    const payload = {
      chargeId:confirmedPaymentIntent.id,
      ownerId: existingListing.user_id,
      amount:(confirmedPaymentIntent.amount/100),
      bookingId:newBooking.id,
      renterId: user_id,
      id: uuidv4(),
    }

    let paymentRecord = await BookingChargeHistory
        .query()
        .insert(payload)
        .then(record => {return record});

    if (!paymentRecord) {
      res.status(500).json({ result: "Issue with saving the record" });
    }
      //function and pass the request
    res.status(200).send({ result: "Successfully created the purchase." }); //update the points here function( rewardType)


  } catch (error) {
    next(error);
  }
}

const createStripeUser = async (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validBody = matchedData(req, { locations: ['body'] });

  const {
    payment_method_id,
    userId
  } = validBody;

  try {

    const user = await User
      .query()
      .eager('[role.[permissions]]')
      .findById(userId);

    if (!user) {
      res.status(400).json({ Error: "User not found." });
    }

    let stripeUserId;

    //Try creating a stripe customer, if not, use existing customer.
    if (user.stripeID === null || user.stripeID === undefined ) {
      const customer = await createCustomer({first_name:user.firstName, last_name:user.lastName, email:user.email});
      stripeUserId = customer.id;
    }else{
      stripeUserId = user.stripeID
    }


    try {

      const stripe_pm = await retrievePaymentMethod({payment_method_id:payment_method_id})

      if (!stripe_pm) {
        return res
          .status(400)
          .send({ Error: error, result: "Stripe payment method could not be found." });
      }


      try {
        const { brand: cardType, last4, exp_month, exp_year } = stripe_pm.card;

        const cardDetails = {
          cardId:stripe_pm.id,
          card_type:cardType,
          exp_month,
          exp_year,
          cardNumber: `XXXX${last4}`,
          active:true,
          customerId: stripeUserId,
          user_id:userId
        };

        let stripeProfile = await StripeProfile
            .query()
            .insert(cardDetails)
            .then(stripe => {return stripe});



        const updatedUser = await User
            .query()
            .omit(['password'])
            .patchAndFetchById(userId, {stripeID:stripeUserId})
            .eager('[role.[permissions], notifications.[actor, type], payment_methods]')
            .then(user => {return user})

        const response = {
          stripeUserId,
          cardId:stripe_pm.id,
          stripeProfile:stripeProfile,
          user:updatedUser
        };


        return res.status(200).send(response);
      } catch (error) {
        console.log(error)
        return res.status(400).send({ error });
      }
    } catch (error) {
      return res
        .status(400)
        .send({ Error: error, result: "Stripe user could not be created." });
    }
  } catch (error) {
    next(error);
  }
}


const paymentIntent = async (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validBody = matchedData(req, { locations: ['body'] });

  const {
    amount
  } = validBody;


  let userId = parseInt(req.user.id)

  const user = await User
    .query()
    .eager('[role.[permissions]]')
    .findById(userId);

  if (!user) {
    res.status(400).json({ Error: "User not found." });
  }

  try {

    const pmIntentSecret = await createPaymentIntent({customerId:user.stripeID, amount:amount})

    if (pmIntentSecret) {
      res.status(200).json(pmIntentSecret);
    } else {
      res.status(500).send({error:"PM intent secret could not be created. Please contact support if issue persistss."}); // 204: No content
    }
  } catch (error) {
    next(error);
  }
}

const paymentMethodIntent = async (req, res, next) => {

  let userId = parseInt(req.user.id)

  const user = await User
    .query()
    .eager('[role.[permissions]]')
    .findById(userId);

  if (!user) {
    res.status(400).json({ Error: "User not found." });
  }

  try {

    const pmIntentSecret = await setupPaymentMethodIntent({customerId:user.stripeID})

    if (pmIntentSecret) {
      res.status(200).json(pmIntentSecret.client_secret);
    } else {
      res.status(500).send({error:"Setup secret could not be created. Please contact support if issue persistss."}); // 204: No content
    }
  } catch (error) {
    next(error);
  }
}



const addPaymentMethod = async (req, res, next) => {

  let userId = parseInt(req.user.id)

  const user = await User
    .query()
    .eager('[role.[permissions]]')
    .findById(userId);

  if (!user) {
    res.status(400).json({ Error: "User not found." });
  }

  try {

    const pmIntentSecret = await setupPaymentMethodIntent({customerId:user.stripeID})

    if (pmIntentSecret) {
      res.status(200).json(pmIntentSecret.client_secret);
    } else {
      res.status(500).send({error:"Setup secret could not be created. Please contact support if issue persistss."}); // 204: No content
    }
  } catch (error) {
    next(error);
  }
}

const getStripeDetails = async (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validBody = matchedData(req, { locations: ['body'] });

  const { userId } = validBody;

  const user = await User
    .query()
    .eager('[role.[permissions]]')
    .findById(userId);

  if (!user) {
    res.status(400).json({ Error: "User not found." });
  }

  try {

  let profile = await StripeProfile
      .query()
      .where('user_id','=', userId)
      .then(profile => {return profile});

    if (profile) {
      res.status(200).json(profile);
    } else {
      res.status(500).send({error:"Stripe User Profile not found. Please try again with a valid id."}); // 204: No content
    }
  } catch (error) {
    next(error);
  }
}

const createOwnerPayoutInfo = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validBody = matchedData(req, { locations: ['body'] });

  const {
    userId,
    account_number,
    routing_number,
    firstName,
    lastName,
    type,
    address_1,
    address_2,
    poBox,
    city,
    state_province,
    country,
    postal_code,
    business_name,
    phone_number,
    dob,
    last4SSN
  } = validBody;


  let account;

  const user = await User
    .query()
    .eager('[role.[permissions]]')
    .findById(userId);

  if (!user) {
    res.status(400).json({ Error: "User not found." });
  }

  try {

    let stripeConnectId;

    //Try creating a stripe customer, if not, use existing customer.
    if (user.stripeConnectID === null || user.stripeConnectID === undefined ) {
      if (type === "business") {
        account = await createConnectSeller({firstName, lastName, email:user.email, account_number, routing_number, type, business_name, address_1, city, postal_code, state_province, phone_number, dob, last4SSN})
      }else if (type === "individual") {
        account = await createConnectSeller({firstName, lastName, email:user.email, account_number, routing_number, type, address_1, city, postal_code, state_province, phone_number, dob, last4SSN})
      }else{
        res.status(400).json({ Error: "Owner seller account can't be created with the type given." });
      }
      stripeConnectId = account.id;
    }else{
      res.status(400).json({ Error: "Connect account for this user already created." });
    }

    const bankInfoPayload = {
      owner_id:userId,
      stripe_token:stripeConnectId,
      region:state_province,
      street_address_1: address_1,
      street_address_2: address_2,
      city:city,
      state_province:state_province,
      country_region:country,
      postal_code:postal_code,
      default_payment:true,
      account_holder_name: `${firstName} ${lastName}`,
      account_holder_type: type,
    };

    let bankInfo = await OwnerBankInformation
        .query()
        .insert(bankInfoPayload)
        .then(info => {return info});


    const updatedUser = await User
        .query()
        .omit(['password'])
        .patchAndFetchById(userId, {stripeConnectID:account.id})
        .then(user => {return user})


    if (bankInfo) {
      let response  = {...account, bankInfo:bankInfo}
      res.status(200).json(response);
    } else {
      res.status(500).send({error:"Bank information Could not be saved."}); // 204: No content
    }
  } catch (error) {
    next(error);
  }
}

const getOwnerPayoutInfo = async (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validBody = matchedData(req, { locations: ['body'] });

  const { userId } = validBody;

  const user = await User
    .query()
    .eager('[role.[permissions]]')
    .findById(userId);

  if (!user) {
    res.status(400).json({ Error: "User not found." });
  }

  try {

  let ownerBankInfo = await OwnerBankInformation
      .query()
      .findOne({owner_id:userId})
      .then(info => {return info});

    let stripeData = retrieveSellerAccount({account:user.stripeConnectID})

    if (ownerBankInfo) {
      let response  = {...ownerBankInfo, stripe_data:stripeData}
      res.status(200).json(response);
    } else {
      res.status(500).send({error:"Owner's bank information not found. Please try again with a valid id."}); // 204: No content
    }
  } catch (error) {
    next(error);
  }
}


const createBooking = async (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validBody = matchedData(req, { locations: ['body'] });

  const { renter_user_id, owner_id, booking_duration, booking_guests, booking_dates, booking_times, booking_date_from, booking_date_to } = validBody;

  const user = await User
    .query()
    .eager('[role.[permissions]]')
    .findById(renter_user_id);

  if (!user) {
    res.status(400).json({ Error: "User for renter_user_id not found." });
  }

  try {
    const newBooking = await Bookings
        .query()
        .insert(validBody)
        .then(booking => {return booking})

    if (newBooking) {
      return res.status(200).json(newBooking)
    }else{
      return res.status(500).json({msg:"Booking could not be created."})
    }
  } catch (error) {
    next(error);
  }
}

const getBookingsByUserId = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validBody = matchedData(req, { locations: ['body'] });

  const { user_id, owner } = validBody;

  try {
    let bookings;
    if (owner === true) {
      bookings = await Bookings
          .query()
          .where('owner_id','=',user_id)
          .then(list => {return list})
    }else{
      bookings = await Bookings
          .query()
          .where('renter_user_id','=',user_id)
          .then(list => {return list})
    }


    if (bookings) {
      return res.status(200).json(bookings)
    }else{
      return res.status(404).json({msg:"Bookings could not be found with this user ID."})
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({msg:"A server error has occurred, please try again later or contact support."})
    ///next(error);
  }
}


const cancelBooking = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validBody = matchedData(req, { locations: ['body'] });

  const { id } = validBody;

  try {

    const deletedBooking = await Bookings
        .query()
        .findOne({id:id})
        .delete()

    if (deletedBooking) {
      return res.status(200).json(deletedBooking)
    }else{
      return res.status(404).json({msg:"Booking could not be found with this ID."})
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({msg:"A server error has occurred, please try again later or contact support."})
    ///next(error);
  }
}

module.exports = { getStripeDetails, createStripeUser, makeStripeCharge, createOwnerPayoutInfo, getOwnerPayoutInfo, createBooking, getBookingsByUserId, cancelBooking, paymentMethodIntent, paymentIntent};
