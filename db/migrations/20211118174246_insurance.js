const tableName = 'insurance';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('insurance_id');
    table.integer('listing_id').unsigned();
    table.boolean('waterpins_insurance').defaultTo(false)
    table.boolean('own_insurance').defaultTo(true)
    table.foreign('listing_id').references('listing.listing_id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
