const tableName = 'bookings';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('booking_id');
    table.integer('owner_id').unsigned();
    table.integer('renter_user_id').unsigned();
    table.integer('list_id').unsigned();
    table.string('booking_duration')
    table.integer('booking_guests').unsigned().defaultTo(1);
    table.string('booking_dates')
    table.string('booking_times')
    table.timestamp('booking_date_from')
    table.timestamp('booking_date_to')
    table.integer('owner_notified').unsigned().defaultTo(0);
    table.string('status')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at')

    table.foreign('owner_id').references('users.id');
    table.foreign('renter_user_id').references('users.id');


  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
