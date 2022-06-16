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

class ListingFavorites extends Model {
  static get tableName() {
    return 'listing_favorites';
  }

  static get idColumn() {
   return 'favorite_id';
  }

  static get relationMappings() {
    const User = require('./User');
    const Listing = require('./Listing');

    return {
      user: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          to: 'listing_favorites.user_id'
        }
      },
      listing: {
        relation: Model.HasOneRelation,
        modelClass: Listing,
        join: {
          from: 'listing.listing_id',
          to: 'listing_favorites.listing_id'
        }
      }
    }
  }
}

module.exports = ListingFavorites;
