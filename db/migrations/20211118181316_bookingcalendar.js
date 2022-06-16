const tableName = 'booking_calendar_availability';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('booking_calendar_availability_id');
    table.integer('booking_id').unsigned();
    table.integer('listing_id').unsigned();
    table.integer('booking_blocked').unsigned();
    table.string('booked_dates_times')
    table.timestamp('created_at').defaultTo(knex.fn.now())

    table.foreign('booking_id').references('bookings.booking_id');
    table.foreign('listing_id').references('listing.listing_id');

  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
