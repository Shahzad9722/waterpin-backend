const tableName = 'listing';

exports.up = function(knex) {
  return knex.schema.table(tableName, table => {
    table.string('latLocation')
    table.string('lngLocation')

  });
};

exports.down = function(knex) {
  return knex.schema.table(tableName, function(table) {
    table.dropColumn('latLocation')
    table.dropColumn('lngLocation')
  })
};
