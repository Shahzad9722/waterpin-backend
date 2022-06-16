const tableName = "destinations";
exports.up = function (knex) {
  return knex.schema.alterTable(tableName, (table) => {
    table.text("city_description").alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable(tableName, (table) => {
    table.string("city_description").alter();
  });
};
