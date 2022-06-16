const stripe = require('stripe')(process.env.STRIPE_KEY_SECRET);

const confirmPaymentIntent = async ({ pmId, paymentIntentID }) => {
  try {

    const paymentIntent = await stripe.paymentIntents.confirm(
    paymentIntentID,
    {payment_method: pmId}
  );

    return paymentIntent;
  } catch (e) {
    console.log(e)
    return e
  }
};

const calculateListingPricing = async ({ existingListing, duration,  }) => {
  try {
    let dayTripPricing = false;
    let days = 0;
    let weeks = 0;
    let hours = 0;
    let mins = 0;

    if (duration.days !== "") {
      days = parseInt(duration.days)
    }

    if (duration.weeks !== "") {
      weeks = parseInt(duration.weeks)
    }

    if (duration.hours !== "") {
      hours = parseInt(duration.hours)
    }

    let taxes = 0.00
    let fees = 0.00
    let taxes_fees = 0.00
    let subtotal = 0.00
    let gratuity = 0.00
    let total = 0.00


    if (parseInt(duration.days) === 0) {
      dayTripPricing = true
    }

    let pricingData = null
    if (dayTripPricing) {
      let priceFor4Hour = existingListing.day_trip_related.price_for_4_hours
      let priceFor6Hour = existingListing.day_trip_related.price_for_6_hours
      let priceFor8Hour = existingListing.day_trip_related.price_for_8_hours
      let dayTripPrice = "0.00"

      if (hours === 4) {
        dayTripPrice = priceFor4Hour
      }

      if (hours === 6) {
        dayTripPrice = priceFor6Hour
      }

      if (hours === 8) {
        dayTripPrice = priceFor8Hour
      }

      subtotal = parseFloat(dayTripPrice)
      gratuity = existingListing.day_trip_related.gratuity
      taxes = parseFloat(existingListing.day_trip_related.taxes) * subtotal
      //fees = existingListing.day_trip_related.apa
      taxes_fees = parseFloat(taxes) + parseFloat(fees)
      total =  parseFloat(gratuity) + parseFloat(taxes_fees) + parseFloat(subtotal)


    }else{
        let pricePerDay = existingListing.overnights_related.price_per_day
        let pricePerWeek = existingListing.overnights_related.price_per_week
        let daysTotal = pricePerDay * days
        let weeksTotal = pricePerWeek * weeks

        subtotal = daysTotal + weeksTotal
        gratuity = existingListing.overnights_related.gratuity
        taxes = parseFloat(existingListing.overnights_related.taxes) * subtotal
        fees = existingListing.overnights_related.apa
        taxes_fees = parseFloat(taxes) + parseFloat(fees)
        total =  parseFloat(gratuity) + parseFloat(taxes_fees) + parseFloat(daysTotal) + parseFloat(weeksTotal)
    }


    pricingData = {total:total.toFixed(2), subtotal:subtotal.toFixed(2), gratuity:gratuity, fees:fees, taxes:taxes.toFixed(2), taxes_fees:taxes_fees.toFixed(2), }

    console.log(pricingData)

    return pricingData;
  } catch (e) {
    console.log(e)
    return e
  }
};

const createPaymentIntent = async ({ customerId, amount }) => {
  try {

    let amountParsed = parseFloat(amount)
    let amt = amountParsed * 100

    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amt),
      currency: 'usd',
      customer:customerId,
      payment_method_types: ['card'],
    });

    return paymentIntent;
  } catch (e) {
    console.log(e)
    return e
  }
};




const retrievePaymentMethod = async ({ payment_method_id }) => {
  try {
    const paymentMethod = await stripe.paymentMethods.retrieve(
      payment_method_id
    );

    return paymentMethod;
  } catch (e) {
    console.log(e)
    return e
  }
};

const setupPaymentMethodIntent = async ({ customerId }) => {
  try {
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
    });

    return setupIntent;
  } catch (e) {
    console.log(e)
    return e
  }
};

const createCharge = async ({ amount, customerId, receipt_email, description }) => {
  try {

    const charge = await stripe.charges.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      customer: customerId,
      receipt_email: receipt_email,
      description: description,
    });

    return charge;
  } catch (e) {
    console.log(e)
    return e
  }
};



const retrieveCardSource = async ({ stripeUserId, cardId }) => {
  try {
    const card = await stripe.customers.retrieveSource(stripeUserId, cardId)

    return card;
  } catch (e) {
    console.log(e)
    return e
  }
};

const createCardSource = async ({ cardToken, stripeUserId }) => {
  try {
    const card = await stripe.customers.createSource(stripeUserId, {
      source: `${cardToken.id}`,
    });

    return card;
  } catch (e) {
    console.log(e)
    return e
  }
};


const createCardToken = async ({ card }) => {
  try {
    const token = await stripe.tokens.create({
      card: {
        name: card.cardName,
        number: card.cardNumber,
        exp_month: card.cardExpMonth,
        exp_year: card.cardExpYear,
        cvc: card.cardCVC,
        address_country: card.country,
        address_zip: card.postal_code,
      },
    });

    return token;
  } catch (e) {
    console.log(e)
    return e
  }
};


const getAllConnectCustomers = async ({ account }) => {
  try {
    const customers = await stripe.customers.list({
      limit: 100
    },{
      stripeAccount: account,
    });

    return customers;
  } catch (e) {
    console.log(e)
    return e
  }
};

const retrieveConnectCustomer = async ({ customer, account }) => {
  try {
    const resp = await stripe.customers.retrieve(
      customer, {
        stripeAccount: account,
      }
    );

    return resp;
  } catch (e) {
    console.log(e)
    return e
  }
};


const retrieveCustomer = async ({ customer }) => {
  try {
    const resp = await stripe.customers.retrieve(
      customer
    );

    return resp;
  } catch (e) {
    console.log(e)
    return e
  }
};



const createCustomer = async ({ email, first_name, last_name }) => {
  try {
    const customer = await stripe.customers.create({
      email: email,
      name: `${first_name} ${last_name}`,
    });

    return customer;
  } catch (e) {
    console.log(e)
    return e
  }
};


const createConnectCustomer = async ({ payment_method, account, customerObj }) => {
  try {
    const customer = await stripe.customers.create({
      email: customerObj.email,
      first_name: customerObj.first_name,
      last_name: customerObj.last_name,
      payment_method : payment_method,
    }, {
      stripeAccount: account,
    });

    return customer;
  } catch (e) {
    console.log(e)
    return e
  }
};



const deleteCustomer = async ({ stripeID }) => {
  try {
    const deleted = await stripe.accounts.del(stripeID);
    return deleted;
  } catch (e) {
    console.log(e)
    return e
  }
};


const deleteConnectSeller = async ({ stripeSellerID }) => {
  try {
    const deleted = await stripe.customers.del(stripeSellerID);
    return deleted;
  } catch (e) {
    console.log(e)
    return e
  }
};



const createConnectSeller = async ({ email, firstName, lastName, type, routing_number, account_number, business_name,address_1, city, postal_code, state_province, phone_number, dob, last4SSN}) => {
  try {

    let account;
    let dobSplit = dob.split('/')

    if (type === "individual") {

      const accountToken = await stripe.tokens.create({
        account: {
          business_type:type,
          individual:{
            address:{
              line1:address_1,
              city: city,
              state: state_province,
              postal_code:postal_code
            },
            email:email,
            first_name: firstName,
            last_name: lastName,
            ssn_last_4:last4SSN,
            phone:phone_number,
            dob:{
              day:dobSplit[1],
              month:dobSplit[0],
              year:dobSplit[2]
            }
          },
          tos_shown_and_accepted: true,
        },
      });

      account = await stripe.accounts.create({
        type: 'custom',
        country: 'US',
        email: email,
        capabilities: {
          card_payments: {requested: true},
          transfers: {requested: true},
        },
        account_token:accountToken.id,
        business_profile:{
          mcc:"4722",
          url:"https://waterpin.com/users",
        },
        external_account:{
          object:'bank_account',
          account_holder_name:`${firstName} ${lastName}`,
          account_holder_type:type,
          routing_number:routing_number,
          account_number:account_number,
          country: 'US',
          currency: "usd",
        }
      });
    }else if (type === "company") {


      const accountToken = await stripe.tokens.create({
        account: {
          business_type:type,
          company:{
            mcc:"4722",
            name:business_name,
            address:{
              line1:address_1,
              city: city,
              state: state_province
            },
            registration_number:last4SSN,
            phone:phone_number,
            support_email:email,
            product_description:'Waterpin Seller for Boat Rental / Water Activities'
          },
          tos_shown_and_accepted: true,
        },
      });


      account = await stripe.accounts.create({
        type: 'custom',
        country: 'US',
        email: email,
        capabilities: {
          card_payments: {requested: true},
          transfers: {requested: true},
        },
        account_token:accountToken.id,
        external_account:{
          object:'bank_account',
          account_holder_name:name,
          account_holder_type:type,
          routing_number:routing_number,
          account_number:account_number,
          country: 'US',
          currency: "usd",
        }
      });
    }else{
      return null
    }

    return account;
  } catch (e) {
    console.log(e)
    return e
  }
};

const createConnectLoginLink = async ({ account }) => {
  try {
    const link = await stripe.accounts.createLoginLink(account);
    return link;
  } catch (e) {
    console.log(e)
    return e
  }
};

const createAccountLink = async ({ account, refresh_url, return_url, type }) => {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: account,
      refresh_url: refresh_url,
      return_url: return_url,
      type: type,
    });

    return accountLink;
  } catch (e) {
    console.log(e)
    return e
  }
};

const createPortalLink = async ({ account, return_url }) => {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: account,
      return_url: return_url,
    });

    return session;
  } catch (e) {
    console.log(e)
    return e
  }
};

const createConnectTransfer = async ({ account, amount }) => {
  try {
    const transfer = await stripe.transfers.create({
      amount: amount,
      currency: 'usd',
      destination: account,
    });

    return transfer;
  } catch (e) {
    console.log(e)
    return e
  }
};

const createCheckoutSession = async ({ account, amount, priceId, slug, owner_id}) => {
  try {

    const session = await stripe.checkout.sessions.create({
      success_url: `http://localhost:3000/${slug}?session_id={CHECKOUT_SESSION_ID}&&amount=${amount}&&success=true&&owner_id=${owner_id}`,
      cancel_url: `http://localhost:3000/${slug}?session_id={CHECKOUT_SESSION_ID}&&success=false`,
      payment_method_types: ['card'],
      line_items: [
        {price: priceId, quantity: 1},
      ],
      mode: 'subscription',
    },{stripe_account: account});

    return session;
  } catch (e) {
    console.log(e)
    return e
  }
};

const getCheckoutSession = async ({ account, sessionId }) => {
  try {

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return session;
  } catch (e) {
    console.log(e)
    return e
  }
};

const getConnectCheckoutSession = async ({ account, sessionId }) => {
  try {

    const session = await stripe.checkout.sessions.retrieve(sessionId ,{stripe_account: account});

    return session;
  } catch (e) {
    console.log(e)
    return e
  }
};

const retrieveSellerAccount = async ({ account }) => {
  try {
    const accountObj = await stripe.accounts.retrieve(
      account
    );

    return accountObj;
  } catch (e) {
    console.log(e)
    return e
  }
};

const getPrices = async ({ product_id }) => {
  try {

    const prices = await stripe.prices.list({
      limit: 10,
      product: product_id
    });

    return prices;
  } catch (e) {
    console.log(e)
    return e
  }
};

module.exports = { createCustomer, createConnectSeller, createAccountLink, createPortalLink, getCheckoutSession, retrieveSellerAccount, deleteCustomer, deleteConnectSeller,
  createConnectTransfer, createCheckoutSession, getPrices, getConnectCheckoutSession, createConnectLoginLink, retrieveCardSource, createCardSource, createCardToken, setupPaymentMethodIntent, retrievePaymentMethod, calculateListingPricing, createPaymentIntent, confirmPaymentIntent};
