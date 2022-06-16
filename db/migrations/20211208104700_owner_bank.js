const tableName = 'owner_bank_information';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('owner_bank_information_id');
    table.integer('owner_id').unsigned();
    table.string('stripe_token');
    table.string('region');
    table.string('payout_methods');
    table.string('bank_account_type');
    table.string('account_holder_name');
    table.string('account_holder_type');
    table.string('street_address_1');
    table.string('street_address_2');
    table.string('po_box');
    table.string('city');
    table.string('state_province');
    table.string('postal_code');
    table.string('country_region');
    table.boolean('default_payment').defaultTo(false)

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at')

    table.foreign('owner_id').references('users.id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
