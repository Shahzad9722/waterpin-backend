const tableName = 'listing_status_types';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('listing_status_type_id');
    table.string('listing_status')
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
