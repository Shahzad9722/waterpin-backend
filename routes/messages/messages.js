const express = require('express');
const router = express.Router();
const { createNewChatThread, updateChatThread, deleteChatThread, getChatThreadById, getAllChatThreadsOwner, getAllChatThreadsRenter } = require( '../../controllers/messages.controller');
const { query, check, param} = require('express-validator');


/**
 * @route GET /chat/threads/renter/
 * @group ChatThread
 * @returns {<Array.ChatThreadResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/threads/renter/', getAllChatThreadsRenter);

/**
 * @route GET /chat/threads/owner/
 * @group ChatThread
 * @returns {<Array.ChatThreadResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/threads/owner/', getAllChatThreadsOwner);

/**
 * @route GET /chat/threads/:id/
 * @group ChatThread
 * @returns {<ChatThreadResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/threads/:id',param('id').exists(), getChatThreadById);


/**
 * @route POST /chat/threads/
 * @group ChatThread
 * @param {ChatThread.model} chat_thread.body.required
 * @returns {<ChatThreadResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */

router.post('/threads', [
  check('renter_id').exists(),
  check('owner_id').exists(),
  check('listing_id').exists(),
  check('booking_id').exists(),
  check('notes').optional({nullable: true}),
  check('meta_data').optional({nullable: true}),
], createNewChatThread);

/**
 * @route PATCH /chat/threads/
 * @group ChatThread
 * @returns {<ChatThreadResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.patch('/threads/:id',[
  param('id').exists(),
  check('renter_id').optional({nullable: true}),
  check('owner_id').optional({nullable: true}),
  check('listing_id').optional({nullable: true}),
  check('booking_id').optional({nullable: true}),
  check('notes').optional({nullable: true}),
  check('meta_data').optional({nullable: true}),
  check('archived').optional({nullable: true}),
  check('status').optional({nullable: true}),
  check('lastMessage').optional({nullable: true}),
], updateChatThread);


/**
 * @route DELETE /chat/threads/
 * @group ChatThread
 * @returns {<ChatThreadResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.delete('/threads/:id', param('id').exists(), deleteChatThread);



module.exports = router;
