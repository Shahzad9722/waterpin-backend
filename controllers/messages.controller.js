const { matchedData, validationResult } = require('express-validator');
const User = require('../models/User');
const ChatThread = require('../models/ChatThread');
const Bookings = require('../models/Bookings');

const { v4: uuidv4 } = require("uuid");

const { raw } = require('objection');


const createNewChatThread = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validBody = matchedData(req, { locations: ['body'] });

  const { renter_id, owner_id, listing_id, booking_id, meta_data  } = validBody;

  let pubnub_threadID = `thread-`+ uuidv4()
  let payload = {
    ...validBody,
    status:0,
    pubnub_thread_id: pubnub_threadID
  }

  try {
    //Check if the authorized user can edit this.
    let existingRenterUser = await User
        .query()
        .findOne({id:renter_id})
        .then(user => {return user})

    if (!existingRenterUser) {
      return res.status(404).send({error:"The renter_id provided did not match a user record."}); // 204: No content
    }


    let existingOwnerUser = await User
        .query()
        .findOne({id:owner_id})
        .then(user => {return user})

    if (!existingOwnerUser) {
      return res.status(404).send({error:"The owner_id provided did not match a user record."}); // 204: No content
    }


    let existingBooking = await Bookings
        .query()
        .findOne({booking_id:booking_id})
        .then(booking => {return booking})

    if (!existingBooking) {
      return res.status(404).send({error:"The booking_id provided did not match a bookings record."}); // 204: No content
    }

  } catch (error) {
    console.log(error)
    return res.status(500).json({msg:"A server error has occurred, please try again later or contact support."})
  }

  try {

    const newThread = await ChatThread
        .query()
        .insert(payload)
        .then(thread => {return thread})

    if (newThread) {
      return res.status(200).json(newThread)
    }else{
      return res.status(404).json({msg:"Chat thread could not be created."})
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({msg:"A server error has occurred, please try again later or contact support."})
  }
}


const updateChatThread = async (req, res, next) => {
  let user_id = parseInt(req.user.id);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validParams = matchedData(req, { locations: ['params'] });
  const validBody = matchedData(req, { locations: ['body'] });

  const { id } = validParams;


  try {

      let existingChatThread = await ChatThread
          .query()
          .findOne({chat_thread_id:id})
          .then(thread => {return thread})

      if (!existingChatThread) {
        return res.status(404).send({error:"This chat thread could not be found."}); // 204: No content
      }

      const updatedThread = await ChatThread
          .query()
          .patchAndFetchById(id, validBody)
          .eager('[renter, owner, listing, booking]')
          .then(thread => {return thread})

    if (updatedThread) {
      return res.status(200).json(updatedThread)
    } else {
      res.status(404).send({error:"Chat Thread not found, or invalid permissions. Please try again with a valid id."}); // 204: No content
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({error:"A server error has occurred. Please try again later."})
  }
}



const deleteChatThread = async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array() });
    }

    const validParams = matchedData(req, { locations: ['params'] });

    const { id } = validParams;

    try {

    //avoid full deletion for now.
    let deleted = await ChatThread
        .query()
        .findOne({chat_thread_id:id})
        .update({archived:true})
        .then(thread => {return thread});

      if (deleted) {
        res.status(200).json({msg:"Chat Thread successfully archived for deletion."});
      } else {
        res.status(404).send({error:"Chat thread not found, or invalid permissions. Please try again with a valid id."}); // 204: No content
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({error:"A server error has occurred. Please try again later."})
    }
}

const getChatThreadById = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validParams = matchedData(req, { locations: ['params'] });

  const { id } = validParams;

  try {

  let chatThread = await ChatThread
      .query()
      .findOne({chat_thread_id:id})
      .eager('[renter, owner, listing, booking]')
      .then(listing => {return listing});

    if (chatThread) {
      res.status(200).json(chatThread);
    } else {
      res.status(404).send({error:"Chat thread not found. Please try again with a valid id."}); // 204: No content
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({error:"A server error has occurred. Please try again later."})
  }
}

const getAllChatThreadsRenter = async (req, res, next) => {
  let userId = parseInt(req.user.id)

  try {

  let chatThreads = await ChatThread
      .query()
      .where('renter_id','=', userId)
      .eager('[owner]')
      .then(thread => {return thread});

    if (chatThreads) {
      res.status(200).json(chatThreads);
    } else {
      res.status(404).send({error:"Chat threads could not be retrieved. Please try again."}); // 204: No content
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({error:"A server error has occurred. Please try again later."})
  }
}

const getAllChatThreadsOwner = async (req, res, next) => {
  let userId = parseInt(req.user.id)

  try {

  let chatThreads = await ChatThread
      .query()
      .where('owner_id','=', userId)
      .eager('[renter]')
      .then(thread => {return thread});

    if (chatThreads) {
      res.status(200).json(chatThreads);
    } else {
      res.status(404).send({error:"Chat threads could not be retrieved. Please try again."}); // 204: No content
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({error:"A server error has occurred. Please try again later."})
  }
}



module.exports = { createNewChatThread, updateChatThread, deleteChatThread, getChatThreadById, getAllChatThreadsOwner, getAllChatThreadsRenter};
