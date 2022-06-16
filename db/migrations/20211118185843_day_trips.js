const tableName = 'day_trips';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('day_trip_id');
    table.integer('listing_id').unsigned();

    table.json('day_trip_hours');
    table.integer('guest_capacity').unsigned().defaultTo(1);
    table.decimal('security_deposit').defaultTo(0.00);
    table.decimal('taxes').defaultTo(0.00);
    table.decimal('gratuity').defaultTo(0.00);
    table.string('fuel_policy')
    table.boolean('catering_service').defaultTo(false)
    table.boolean('chef').defaultTo(false)
    table.boolean('additional_crew').defaultTo(false)
    table.json('extra_water_toys');
    table.json('other');
    table.decimal('price_for_4_hours').defaultTo(0.00);
    table.decimal('price_for_6_hours').defaultTo(0.00);
    table.decimal('price_for_8_hours').defaultTo(0.00);

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at')

    table.foreign('listing_id').references('listing.listing_id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
