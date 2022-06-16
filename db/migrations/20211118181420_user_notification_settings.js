const tableName = 'user_notification_settings';

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('user_notification_setting_id');
    table.integer('user_id').unsigned();
    table.integer('upcoming_trips_notifications').unsigned().defaultTo(1);
    table.integer('messages_notifications').unsigned().defaultTo(1);
    table.integer('discount_special_credit_notifications').unsigned().defaultTo(0);
    table.integer('important_messages_news_announcement_notifications').unsigned().defaultTo(0);
    table.integer('reminders_tips_notifications').unsigned().defaultTo(0);
    table.integer('cancelations_notifications').unsigned().defaultTo(1);
    table.integer('get_review_notifications').unsigned().defaultTo(1);
    table.integer('leave_review_notifications').unsigned().defaultTo(0);
    table.integer('booking_expire_notifications').unsigned().defaultTo(0);
    table.integer('unsubscribe_marketing_emails').unsigned().defaultTo(0);
    table.foreign('user_id').references('users.id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
