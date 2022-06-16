const { Model } = require('objection');
const knex = require('../db');

Model.knex(knex);

/**
* @typedef ChatThread
* @property {integer} renter_id.required
* @property {integer} owner_id.required
* @property {integer} listing_id.required
* @property {integer} booking_id.required
* @property {string} notes
* @property {object} meta_data
*/

/**
* @typedef ChatThreadResponse
* @property {integer} chat_thread_id
* @property {integer} renter_id
* @property {integer} owner_id
* @property {integer} listing_id
* @property {integer} booking_id
* @property {integer} status

* @property {string} lastMessage
* @property {string} notes
* @property {object} meta_data
* @property {string} uniqueID
* @property {string} created_at
* @property {string} updated_at
* @property {boolean} archived

*/
class ChatThread extends Model {
  static get tableName() {
    return 'chat_thread';
  }

  static get idColumn() {
   return 'chat_thread_id';
  }

  static get relationMappings() {
      const User = require('./User');
      const Listing = require('./Listing');
      const Bookings = require('./Bookings');

      return {
        renter: {
          relation: Model.HasOneRelation,
          modelClass: User,
          filter: query => query.select('id', 'username', 'firstName','lastName','email','profileImage', 'pubnubID'),
          join: {
            from: 'users.id',
            to: 'chat_thread.renter_id'
          }
        },
        owner: {
          relation: Model.HasOneRelation,
          filter: query => query.select('id', 'username', 'firstName','lastName', 'email','profileImage','pubnubID'),
          modelClass: User,
          join: {
            from: 'users.id',
            to: 'chat_thread.owner_id'
          }
        },
        listing: {
          relation: Model.HasOneRelation,
          modelClass: Listing,
          join: {
            from: 'listing.listing_id',
            to: 'chat_thread.listing_id'
          }
        },
        booking: {
          relation: Model.HasOneRelation,
          modelClass: Bookings,
          join: {
            from: 'bookings.booking_id',
            to: 'chat_thread.booking_id'
          }
        }
      }
  }

}

module.exports = ChatThread;
