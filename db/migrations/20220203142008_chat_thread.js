const tableName = 'chat_thread';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('chat_thread_id');
    table.integer('renter_id').unsigned();
    table.integer('owner_id').unsigned();
    table.integer('listing_id').unsigned();
    table.integer('booking_id').unsigned();
    table.integer('status').unsigned();
    table.string('pubnub_thread_id');
    table.string('lastMessage');
    table.text('notes');
    table.json('meta_data');
    table.uuid('uniqueID').defaultTo(knex.raw('gen_random_uuid()'))
    table.boolean('archived').defaultTo(false)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at')

    table.foreign('renter_id').references('users.id');
    table.foreign('owner_id').references('users.id');
    table.foreign('listing_id').references('listing.listing_id');
    table.foreign('booking_id').references('bookings.booking_id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
