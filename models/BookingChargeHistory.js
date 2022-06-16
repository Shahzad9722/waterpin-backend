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

class BookingChargeHistory extends Model {
  static get tableName() {
    return 'booking_charge_history';
  }

  static get relationMappings() {
    const User = require('./User');

    return {
      owner: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          to: 'booking_charge_history.owner_id'
        }
      },
      renter: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          to: 'booking_charge_history.renter_id'
        }
      }
    }
  }
}

module.exports = BookingChargeHistory;
