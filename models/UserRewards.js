const { Model } = require('objection');
const knex = require('../db');

Model.knex(knex);

class UserRewards extends Model {
  static get tableName() {
    return 'user_rewards';
  }

  static get relationMappings() {
    const Rewards = require('./Rewards');

    return {
      reward: {
        relation: Model.HasOneRelation,
        modelClass: Rewards,
        join: {
          from: 'rewards.id',
          to: 'user_rewards.reward_id'
        }
      }
    }
  }

}

module.exports = UserRewards;
