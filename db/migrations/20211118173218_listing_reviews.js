const tableName = 'listing_reviews';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('review_id');
    table.integer('listing_id').unsigned();
    table.integer('owner_id').unsigned();
    table.integer('renter_id').unsigned();
    table.integer('rating_kindness').unsigned();
    table.integer('rating_communication').unsigned();
    table.integer('rating_service').unsigned();
    table.string('review_comment')
    table.string('review_response')
    table.boolean('review_responded').defaultTo(false)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.foreign('owner_id').references('users.id');
    table.foreign('renter_id').references('users.id');
    table.foreign('listing_id').references('listing.listing_id');

  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
