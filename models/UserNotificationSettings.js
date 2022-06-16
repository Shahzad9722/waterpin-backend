const { Model } = require('objection');
const knex = require('../db');

Model.knex(knex);

/**
* @typedef UserNotificationSettings
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

class UserNotificationSettings extends Model {
  static get tableName() {
    return 'user_notification_settings';
  }

  static get idColumn() {
   return 'user_notification_setting_id';
  }
}

module.exports = UserNotificationSettings;
