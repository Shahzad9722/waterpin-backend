const tableName = "users";

exports.up = function (knex) {
  return knex.schema.alterTable(tableName, (table) => {
    table.text('about_me')
    table.string('rank').defaultTo('new')
    table.string('location')
    table.string('language')
    table.integer('points').unsigned().defaultTo(0);
    table.string('response_time').defaultTo("1 Hour")
    table.decimal('response_rate').defaultTo(1.00);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable(tableName, (table) => {
    table.dropColumn('about_me')
    table.dropColumn('rank')
    table.dropColumn('location')
    table.dropColumn('language')
    table.dropColumn('points')
    table.dropColumn('response_time')
    table.dropColumn('response_rate')
  });
};
