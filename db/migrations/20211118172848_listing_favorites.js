const tableName = 'listing_favorites';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.integer('user_id').unsigned();
    table.increments('favorite_id');
    table.integer('listing_id').unsigned();
    table.timestamp('created_at').defaultTo(knex.fn.now())

    table.foreign('user_id').references('users.id');
    table.foreign('listing_id').references('listing.listing_id');

  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
