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

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get relationMappings() {
    const Role = require('./Role');
    const Notifications = require('./Notifications');
    const StripeProfile = require('./StripeProfile');
    const UserRewards = require('./UserRewards');
    const UserInvites = require('./UserInvites');
    const ListingFavorites = require('./ListingFavorites');
    const ListingReviews = require('./ListingReviews');
    const Listing = require('./Listing');
    const UserNotificationSettings = require('./UserNotificationSettings');
    const Bookings = require('./Bookings');





    return {
      role: {
        relation: Model.HasOneRelation,
        modelClass: Role,
        join: {
          from: 'users.role_id',
          to: 'roles.id'
        }
      },
      notifications: {
        relation: Model.HasManyRelation,
        modelClass: Notifications,
        join: {
          from: 'users.id',
          to: 'notifications.user_id'
        }
      },
      notification_preference: {
        relation: Model.HasOneRelation,
        modelClass: UserNotificationSettings,
        join: {
          from: 'users.id',
          to: 'user_notification_settings.user_id'
        }
      },
      rewards: {
        relation: Model.HasManyRelation,
        modelClass: UserRewards,
        join: {
          from: 'users.id',
          to: 'user_rewards.user_id'
        }
      },
      favorites: {
        relation: Model.HasManyRelation,
        modelClass: ListingFavorites,
        join: {
          from: 'users.id',
          to: 'listing_favorites.user_id'
        }
      },
      payment_methods: {
        relation: Model.HasManyRelation,
        modelClass: StripeProfile,
        join: {
          from: 'users.id',
          to: 'stripe_profile.user_id'
        }
      },

      reviews_recieved: {
        relation: Model.HasManyRelation,
        modelClass: ListingReviews,
        join: {
          from: 'users.id',
          to: 'listing_reviews.owner_id'
        }
      },

      reviews_sent: {
        relation: Model.HasManyRelation,
        modelClass: ListingReviews,
        join: {
          from: 'users.id',
          to: 'listing_reviews.renter_id'
        }
      },

      listings: {
        relation: Model.HasManyRelation,
        modelClass: Listing,
        join: {
          from: 'users.id',
          to: 'listing.user_id'
        }
      },
      bookings: {
        relation: Model.HasManyRelation,
        modelClass: Bookings,
        join: {
          from: 'users.id',
          to: 'bookings.renter_user_id'
        }
      },

      invites: {
        relation: Model.HasManyRelation,
        modelClass: UserInvites,
        join: {
          from: 'users.id',
          to: 'user_invites.user_id'
        }
      },



    }
  }
}

module.exports = User;
