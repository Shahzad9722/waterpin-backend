const tableName = 'cancelation_policy';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('cancelation_policy_id');
    table.integer('listing_id').unsigned();
    table.integer('flexible').unsigned();
    table.integer('moderate').unsigned();
    table.integer('strict').unsigned();
    table.string('use_your_own')
    table.foreign('listing_id').references('listing.listing_id');

  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
