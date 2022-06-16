const tableName = 'amenities_safety';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('amenity_safety_id');
    table.integer('listing_id').unsigned();
    table.integer('life_jacket').unsigned().defaultTo(0);
    table.integer('vhf_radio').unsigned().defaultTo(0);
    table.integer('thrusters').unsigned().defaultTo(0);
    table.integer('stabilizers').unsigned().defaultTo(0);
    table.integer('gps').unsigned().defaultTo(0);
    table.integer('sonar').unsigned().defaultTo(0);
    table.integer('radar').unsigned().defaultTo(0);
    table.integer('medical_kit').unsigned().defaultTo(0);
    table.integer('flashlight').unsigned().defaultTo(0);
    table.string('other_safety_amenities')
    table.foreign('listing_id').references('listing.listing_id');

  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
