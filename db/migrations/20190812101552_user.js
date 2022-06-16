const tabaleName = 'users';

exports.up = knex => {
  return knex.schema.createTable(tabaleName, table => {
    table.increments('id');
    table.integer('role_id').unsigned();
    table.foreign('role_id').references('roles.id');
    table.string('username');
    table.string('password');
    table.string('email');

    table.unique('username');
    table.unique('email');

    table.string('slug')
    table.unique('slug');

    table.string('firstName')
    table.string('lastName')
    table.string('facebookUserId')
    table.string('googleUserId')
    table.timestamp('dob')
    table.string('governmentID')
    table.string('address1')
    table.string('address2')
    table.string('city')
    table.string('state')
    table.string('province')
    table.string('countryCode')

    table.string('emergencyContactNo')
    table.string('emergencyContactName')

    table.string('gIDFront')
    table.string('gIDBack')

    table.string('gender')
    table.string('profileImage')

    table.string('phoneNumber')
    table.unique('phoneNumber');

    table.string('stripeID')
    table.string('stripeConnectID')
    table.decimal('rating')
    table.integer('status').defaultTo(0)
    table.string('pubnubID')
    table.string('verified').defaultTo(`{email:false, phone:false}`)
    table.boolean('is_owner').defaultTo(false)
    table.boolean('emailSignup')
    table.boolean('googleSignup')
    table.boolean('facebookSignup')
    table.boolean('appleSignup')
    table.boolean('twoStepAuth')
    table.boolean('emailTwoStepAuth')
    table.string('notificationsId').defaultTo(knex.raw('gen_random_uuid()'));
    table.timestamp('createdAt').defaultTo(knex.fn.now())
    table.timestamp('updatedAt')
  });
};

exports.down = knex => {
  return knex.schema.dropTable(tabaleName);
};
