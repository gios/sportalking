'use strict'

let db_host = 'ec2-54-217-243-228.eu-west-1.compute.amazonaws.com'
let db_user = 'aqgoxrxhvtqqug'
let db_password = 'MI2540-q1N4TGvQIKzsr6vR46i'
let db_name = 'd5tebjutdcodfk'

const DATABASE_URL = `postgres://${db_user}:${db_password}@${db_host}:5432/${db_name}?ssl=true`

module.exports = {
  client: 'postgresql',
  connection: DATABASE_URL,
  pool: {
    min: 1,
    max: 7
  },
  migrations: {
    tableName: 'knex_migrations'
  }
}