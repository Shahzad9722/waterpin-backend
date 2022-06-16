const tableName = 'booking_charge_history';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.string('id').defaultTo(knex.raw('gen_random_uuid()'));
    table.string('chargeId')
    table.decimal('amount')
    table.integer('owner_id').unsigned();
    table.integer('renter_id').unsigned();
    table.integer('bookingId').unsigned();
    table.foreign('bookingId').references('bookings.booking_id');
    table.foreign('owner_id').references('users.id');
    table.foreign('renter_id').references('users.id');
    table.timestamp('created_at').defaultTo(knex.fn.now())
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
