const tableName = "destinations";
exports.up = function (knex) {
  return knex.schema.alterTable(tableName, (table) => {
    table.string('region')
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable(tableName, (table) => {
    table.dropColumn('region')
  });
};
