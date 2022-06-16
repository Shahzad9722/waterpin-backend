const { Model } = require('objection');
const knex = require('../db');

Model.knex(knex);

/**
* @typedef ListingFavorites
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

class ListingReviews extends Model {
  static get tableName() {
    return 'listing_reviews';
  }


  static get idColumn() {
   return 'review_id';
  }

  static get relationMappings() {
    const User = require('./User');

    return {
      owner: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          to: 'listing_reviews.owner_id'
        }
      },
      renter: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          to: 'listing_reviews.renter_id'
        }
      }
    }
  }
}

module.exports = ListingReviews;
