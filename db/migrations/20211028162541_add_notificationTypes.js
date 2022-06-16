const tableName = 'notifications_types';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('id');
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.string('name')
    table.string('verb')
    table.string('type')
    table.uuid('uniqueID')
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
