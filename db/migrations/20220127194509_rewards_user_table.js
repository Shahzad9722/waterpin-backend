const tableName = 'user_rewards';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('id');
    table.integer('user_id').unsigned();
    table.integer('reward_id').unsigned();
    table.integer('status').unsigned().defaultTo(0);
    table.integer('actionsCompleted').unsigned().defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at')
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
