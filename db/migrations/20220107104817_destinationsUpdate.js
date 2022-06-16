const tableName = "destinations";

exports.up = function (knex) {
  return knex.schema.alterTable(tableName, (table) => {
    table.string('city_name')
    table.string('city_state')
    table.string('city_province')
    table.string('city_zipcode')
    table.string('city_country')
    table.string('city_country_code')
    table.json('city_images');
    table.string('city_location')
    table.string('city_description')
    table.decimal('destination_review_avg').defaultTo(0.00);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable(tableName, (table) => {
    table.dropColumn('city_name')
    table.dropColumn('city_state')
    table.dropColumn('city_province')
    table.dropColumn('city_zipcode')
    table.dropColumn('city_country')
    table.dropColumn('city_country_code')
    table.dropColumn('city_images');
    table.dropColumn('city_location')
    table.dropColumn('city_description')
    table.dropColumn('destination_review_avg')
  });
};
