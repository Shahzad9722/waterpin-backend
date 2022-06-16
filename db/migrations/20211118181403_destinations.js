const tableName = "destinations";

exports.up = function (knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.increments("destination_id");
    table.string("destination_name");
    table.string("location");
    table.json("map_location");
    table.string("lat_delta");
    table.string("long_delta");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(tableName);
};
