const { Model } = require('objection');
const knex = require('../db');

Model.knex(knex);

/**
* @typedef Messages
* @property {string} username.required - Min length 4 characters
* @property {string} password.required - Min length 6 characters
* @property {string} confirm_password.required
* @property {string} email.required - email address
* @property {integer} role_id.required - role id - eg: 2
*/

/**
* @typedef MessagesResponse
* @property {integer} id
* @property {string} username
* @property {string} email
*/

class Notifications extends Model {
  static get tableName() {
    return 'notifications';
  }

  static get relationMappings() {
    const User = require('./User');
    const NotificationTypes = require('./NotificationTypes');

    return {
      type: {
        relation: Model.HasOneRelation,
        modelClass: NotificationTypes,
        join: {
          from: 'notifications_types.id',
          to: 'notifications.notification_type'
        }
      },
      actor: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          to: 'notifications.actor_id'
        }
      }
    }
  }
}

module.exports = Notifications;
