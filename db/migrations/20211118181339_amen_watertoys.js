const tableName = 'amenities_water_toys';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('amenities_water_toys_id');
    table.integer('listing_id').unsigned();
    table.integer('jet_ski').unsigned().defaultTo(0);
    table.integer('tender').unsigned().defaultTo(0);
    table.integer('floatine_mate').unsigned().defaultTo(0);
    table.integer('snorkeling_gear').unsigned().defaultTo(0);
    table.integer('diving_gear').unsigned().defaultTo(0);
    table.integer('paddle_board').unsigned().defaultTo(0);
    table.integer('water_jetpack').unsigned().defaultTo(0);
    table.integer('water_jetslide').unsigned().defaultTo(0);
    table.integer('jacuzzi').unsigned().defaultTo(0);
    table.string('other_jacuzzi_amenities')
    table.foreign('listing_id').references('listing.listing_id');

  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
