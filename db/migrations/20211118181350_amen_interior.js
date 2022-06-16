const tableName = 'amenities_interior';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('amenity_id');
    table.integer('listing_id').unsigned();
    table.integer('bedrooms').unsigned().defaultTo(0);
    table.integer('bathrooms').unsigned().defaultTo(0);
    table.integer('kitchen').unsigned().defaultTo(0);
    table.integer('refrigerator').unsigned().defaultTo(0);
    table.integer('microwave').unsigned().defaultTo(0);
    table.integer('airconditioning').unsigned().defaultTo(0);
    table.integer('tv_stereo').unsigned().defaultTo(0);
    table.string('other_amenities')
    table.foreign('listing_id').references('listing.listing_id');

  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
