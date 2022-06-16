const tableName = 'listing_custom_offers';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('custom_offer_listing_id');
    table.integer('listing_id').unsigned();
    table.integer('owner_id').unsigned();
    table.integer('renter_id').unsigned();

    table.string('offer');
    table.decimal('amount').defaultTo(0.00);
    table.integer('status').unsigned();

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at')

    table.foreign('owner_id').references('users.id');
    table.foreign('renter_id').references('users.id');
    table.foreign('listing_id').references('listing.listing_id');

  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
