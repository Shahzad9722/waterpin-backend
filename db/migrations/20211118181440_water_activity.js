const tableName = 'water_activity';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('water_activity_id');
    table.integer('listing_id').unsigned();
    table.json('options');
    table.string('title')
    table.string('activity_description')
    table.integer('guest_capacity').unsigned().defaultTo(1);
    table.json('deposit_extras');
    table.json('add_ons');
    table.string('where_water_activity_start')
    table.integer('water_activity_type_id').unsigned();
    table.string('status')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at')
    table.foreign('listing_id').references('listing.listing_id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
