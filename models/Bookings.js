const { Model } = require('objection');
const knex = require('../db');

Model.knex(knex);

/**
* @typedef User
* @property {string} username.required - Min length 4 characters
* @property {string} password.required - Min length 6 characters
* @property {string} confirm_password.required
* @property {string} email.required - email address
* @property {integer} role_id.required - role id - eg: 2
*/

/**
* @typedef UserResponse
* @property {integer} id
* @property {string} username
* @property {string} email
* @property {RoleResponse.model} role
*/

class Bookings extends Model {
  static get tableName() {
    return 'bookings';
  }


  static get idColumn() {
   return 'booking_id';
  }

  static get relationMappings() {
    const User = require('./User');
    const Listing = require('./Listing');

    return {
      owner: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          to: 'bookings.owner_id'
        }
      },
      renter: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          to: 'bookings.renter_user_id'
        }
      },
      listing: {
        relation: Model.HasOneRelation,
        modelClass: Listing,
        join: {
          from: 'listing.listing_id',
          to: 'bookings.list_id'
        }
      },
    }
  }
}

module.exports = Bookings;
