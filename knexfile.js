const dotenv=require('dotenv');
dotenv.config({ path: './.env'});


module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      port: process.env.DB_PORT,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    migrations: {
      tableName: 'migrations',
      directory: __dirname + '/db/migrations'
    },
    pool: {
      min: 0,
      max: 10
    },
    seeds: {
      directory: __dirname + '/db/seeds/development'
    }
  },
  staging: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      port: process.env.DB_PORT,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations',
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/staging'
    }
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      port: process.env.DB_PORT,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations',
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/production'
    }
  }
};
