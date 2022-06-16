const tableName = 'listing_types';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('listing_type_id');
    table.string('listing_type_name')
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
