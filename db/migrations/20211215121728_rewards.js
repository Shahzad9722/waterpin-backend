const tableName = 'rewards';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('id');
    table.string('reward_name');
    table.string('requirements');
    table.string('rank');
    table.integer('points').unsigned();
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at')
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
