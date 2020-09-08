const config = require('./src/config');

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "connectionString": (config.NODE_ENV === 'test') ? config.TEST_DATABASE_URL : config.DATABASE_URL,
}