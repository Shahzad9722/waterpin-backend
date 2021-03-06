const { Model } = require('objection');
const knex = require('../db');

Model.knex(knex);

/**
* @typedef StripeProfile
* @property {string} username.required - Min length 4 characters
* @property {string} password.required - Min length 6 characters
* @property {string} confirm_password.required
* @property {string} email.required - email address
* @property {integer} role_id.required - role id - eg: 2
*/

/**
* @typedef StripeProfileResponse
* @property {integer} id
*/

class OwnerBankInformation extends Model {
  static get tableName() {
    return 'owner_bank_information';
  }
  static get idColumn() {
   return 'owner_bank_information_id';
 }

}

module.exports = OwnerBankInformation;
