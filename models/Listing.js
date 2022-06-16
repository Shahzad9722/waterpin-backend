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

class Listing extends Model {
  static get tableName() {
    return 'listing';
  }

  static get idColumn() {
   return 'listing_id';
  }

  static get relationMappings() {
    const ListingStatusTypes = require('./ListingStatusTypes');
    const User = require('./User');
    const DayTrips = require('./DayTrips');
    const AmenitiesInterior = require('./AmenitiesInterior');
    const OvernightStays = require('./OvernightStays');
    const Exterior = require('./Exterior');
    const AmenitiesSafety = require('./AmenitiesSafety');
    const Availability = require('./Availability');
    const WaterActivity = require('./WaterActivity');

    const Insurance = require('./Insurance');
    const ListingTypes = require('./ListingTypes');
    const AmenitiesWaterToys = require('./AmenitiesWaterToys');
    const ListingReviews = require('./ListingReviews');
    const CancelationPolicy = require('./CancelationPolicy');
    const Bookings = require('./Bookings');


    return {
      owner: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          to: 'listing.user_id'
        }
      },
      listing_type: {
        relation: Model.HasOneRelation,
        modelClass: ListingTypes,
        join: {
          from: 'listing_types.listing_type_id',
          to: 'listing.listing_type_id'
        }
      },
      status: {
        relation: Model.HasOneRelation,
        modelClass: ListingStatusTypes,
        join: {
          from: 'listing_status_types.listing_status_type_id',
          to: 'listing.listing_status'
        }
      },
      day_trip_related: {
        relation: Model.HasOneRelation,
        modelClass: DayTrips,
        join: {
          from: 'listing.listing_id',
          to: 'day_trips.listing_id'
        }
      },
      overnights_related: {
        relation: Model.HasOneRelation,
        modelClass: OvernightStays,
        join: {
          from: 'listing.listing_id',
          to: 'overnight_stays.listing_id'
        }
      },
      amenities_interior: {
        relation: Model.HasOneRelation,
        modelClass: AmenitiesInterior,
        join: {
          from: 'amenities_interior.listing_id',
          to: 'listing.listing_id'
        }
      },

      amenities_water_toys: {
        relation: Model.HasOneRelation,
        modelClass: AmenitiesWaterToys,
        join: {
          from: 'amenities_water_toys.listing_id',
          to: 'listing.listing_id'
        }
      },

      exterior: {
        relation: Model.HasOneRelation,
        modelClass: Exterior,
        join: {
          from: 'exterior.listing_id',
          to: 'listing.listing_id'
        }
      },
      amenities_safety: {
        relation: Model.HasOneRelation,
        modelClass: AmenitiesSafety,
        join: {
          from: 'amenities_safety.listing_id',
          to: 'listing.listing_id'
        }
      },
      reviews: {
        relation: Model.HasManyRelation,
        modelClass: ListingReviews,
        join: {
          from: 'listing_reviews.listing_id',
          to: 'listing.listing_id'
        }
      },
      availability: {
        relation: Model.HasOneRelation,
        modelClass: Availability,
        join: {
          from: 'availability.listing_id',
          to: 'listing.listing_id'
        }
      },
      cancelation_policy: {
        relation: Model.HasOneRelation,
        modelClass: CancelationPolicy,
        join: {
          from: 'cancelation_policy.listing_id',
          to: 'listing.listing_id'
        }
      },
      water_activity: {
        relation: Model.HasOneRelation,
        modelClass: WaterActivity,
        join: {
          from: 'water_activity.listing_id',
          to: 'listing.listing_id'
        }
      },
      insurance: {
        relation: Model.HasOneRelation,
        modelClass: Insurance,
        join: {
          from: 'insurance.listing_id',
          to: 'listing.listing_id'
        }
      },
      bookings: {
        relation: Model.HasManyRelation,
        modelClass: Bookings,
        join: {
          from: 'bookings.list_id',
          to: 'listing.listing_id'
        }
      },

    }
  }
}

module.exports = Listing;
