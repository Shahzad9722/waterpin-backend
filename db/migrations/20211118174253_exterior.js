const tableName = 'exterior';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('amenity_exterior_id');
    table.integer('listing_id').unsigned();

    table.integer('flybridge').unsigned().defaultTo(0);
    table.integer('swim_platform').unsigned().defaultTo(0);
    table.integer('swim_ladder').unsigned().defaultTo(0);
    table.integer('anchor').unsigned().defaultTo(0);
    table.integer('shower').unsigned().defaultTo(0);
    table.integer('grill').unsigned().defaultTo(0);
    table.integer('cooler').unsigned().defaultTo(0);
    //JSON
    table.json('other_exterior_amenities')
    table.foreign('listing_id').references('listing.listing_id');

  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
