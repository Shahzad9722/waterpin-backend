const tableName = "bookings";
exports.up = function (knex) {
  return knex.schema.alterTable(tableName, (table) => {
    table.decimal('total').defaultTo(0.00);
    table.decimal('taxes').defaultTo(0.00);
    table.decimal('fees').defaultTo(0.00);
    table.decimal('other_total').defaultTo(0.00);
    table.string('confirmation_id')
    table.text('booking_message')
    table.string('special_occasion')

  });
};

exports.down = function (knex) {
  return knex.schema.alterTable(tableName, (table) => {
    table.dropColumn('total')
    table.dropColumn('taxes')
    table.dropColumn('fees')
    table.dropColumn('other_total')
    table.dropColumn('confirmation_id')
    table.dropColumn('booking_message')
    table.dropColumn('special_occasion')

  });
};
