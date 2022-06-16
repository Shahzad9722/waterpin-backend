const tableName = 'availability';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('yacht_availability_id');
    table.integer('listing_id').unsigned();
    table.json('yacht_availability');
    table.string('availability_type')
    table.json('how_far_in_advance_book')
    table.string('yacht_availability_status')
    table.json('restrict_month');
    table.foreign('listing_id').references('listing.listing_id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
