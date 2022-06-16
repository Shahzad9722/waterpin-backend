const tableName = 'water_activity_types';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('water_activity_type_id');
    table.string('water_activity_type_name')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at')
    table.boolean('active').defaultTo(true)
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
