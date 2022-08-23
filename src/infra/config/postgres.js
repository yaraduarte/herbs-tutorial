const env = require('sugar-env')
require('dotenv').config()

module.exports = {
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'postgrespw',
    database: 'postgres',
    port: 49153
  }
}