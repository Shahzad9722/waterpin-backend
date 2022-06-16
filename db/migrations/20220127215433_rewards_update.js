const tableName = "rewards";
exports.up = function (knex) {
  return knex.schema.alterTable(tableName, (table) => {
    table.integer('actionsRequired').unsigned().defaultTo(1);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable(tableName, (table) => {
    table.dropColumn('actionsRequired')
  });
};
