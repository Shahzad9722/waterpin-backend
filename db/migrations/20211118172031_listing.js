const tableName = 'listing';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('listing_id');
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.string('location')
    //JSON
    table.json('images')
    table.string('marina_name')
    table.string('dock')
    table.string('slip_number')
    table.string('country')
    table.string('street_address')
    table.string('city')
    table.string('province')
    table.string('zip_code')
    table.string('list_details')
    table.string('list_details_operator')
    table.string('list_details_name')
    table.string('list_details_type')
    table.string('list_details_make')
    table.string('model')
    table.string('year')
    table.string('length')
    table.string('rules')
    table.string('listing_name')
    table.string('list_discription')
    table.integer('day_trips').unsigned();
    table.integer('overnight_stays').unsigned();
    table.integer('listing_type_id').unsigned();
    table.integer('listing_status').unsigned();
    table.integer('user_id').unsigned();

    table.boolean('archived').defaultTo(false)
    table.foreign('user_id').references('users.id');

  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
