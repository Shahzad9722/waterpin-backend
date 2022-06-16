const tableName = 'stripe_profile';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('id');
    table.string('cardId')
    table.string('customerId')
    table.string('cardNumber')
    table.string('exp_year')
    table.string('exp_month')
    table.string('card_type')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at')
    table.boolean('active').defaultTo(true)

    table.integer('user_id').unsigned();
    table.foreign('user_id').references('users.id');

  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
