module.exports = {
  development: {
          client: 'postgresql',
          connection: {
          database: 'postgres',
          user: 'postgres',
          password: 'postgrespw',
          host: '127.0.0.1',
          port: 49153
      },
      migrations: {
          directory: './src/infra/data/database/migrations',
          tableName: 'knex_migrations'
      }
  },
  staging: {},
  production: {}
}
