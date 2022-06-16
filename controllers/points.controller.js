const { matchedData, validationResult } = require('express-validator');
const User = require('../models/User');
const Notifications = require('../models/Notifications');
const { v4: uuidv4 } = require('uuid');
const { raw } = require('objection');
const { createAccountLink, createConnectLoginLink, createConnectSeller, createPortalLink, retrieveSellerAccount, deleteConnectSeller, deleteCustomer, createSellerSubscription } = require('../utils/stripe-utils');
const bcrypt = require('bcrypt');
const Rewards = require("../models/Rewards");
const UserRewards = require('../models/UserRewards')
const getPointsAndRewardsByUserId = async (req, res, next) => {



}


//reward action type


    






module.exports = { getPointsAndRewardsByUserId };
