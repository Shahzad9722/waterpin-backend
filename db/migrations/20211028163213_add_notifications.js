const tableName = 'notifications';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('id');
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.boolean('is_read').defaultTo(false)
    table.boolean('is_deleted').defaultTo(false)
    table.string('url')
    table.uuid('uniqueID')
    table.integer('user_id').unsigned();
    table.integer('object_id').unsigned();
    table.integer('actor_id').unsigned();
    table.integer('notification_type').unsigned();
    table.foreign('user_id').references('users.id');
    table.foreign('actor_id').references('users.id');
    table.foreign('notification_type').references('notifications_types.id');

  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
