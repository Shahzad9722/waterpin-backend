const tableName = 'destination_cities';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('destination_city_id');
    table.integer('destination_id').unsigned();
    table.string('city_name')
    table.string('city_state')
    table.string('city_province')
    table.string('city_zipcode')
    table.string('city_country')
    table.string('city_country_code')
    table.json('city_images');
    table.string('city_location')
    table.string('city_description')
    table.decimal('destination_review_avg').defaultTo(5);
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at')

    table.foreign('destination_id').references('destinations.destination_id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
