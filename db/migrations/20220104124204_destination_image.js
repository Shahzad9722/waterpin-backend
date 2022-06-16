const tableName = "destinations";

exports.up = function (knex) {
  return knex.schema.alterTable(tableName, (table) => {
    table.string("destination_image");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable(tableName, (table) => {
    table.dropColumn("destination_image");
  });
};
