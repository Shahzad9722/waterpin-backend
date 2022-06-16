const { Model } = require('objection');
const knex = require('../db');

Model.knex(knex);

/**
* @typedef Exterior
* @property {integer} listing_id.required - Min length 4 characters
* @property {integer} flybridge.required - Min length 6 characters
* @property {integer} swim_platform.required
* @property {integer} swim_ladder.required - email address
* @property {integer} anchor.required - role id - eg: 2
*/

/**
* @typedef UserResponse
* @property {integer} id
* @property {string} username
* @property {string} email
* @property {RoleResponse.model} role
*/

class Exterior extends Model {
  static get tableName() {
    return 'exterior';
  }

  static get idColumn() {
   return 'amenity_exterior_id';
  }

}

module.exports = Exterior;
