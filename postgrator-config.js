const config = require('./src/config');

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "connectionString": (config.DATABASE_URL === 'test') ? config.TEST_DATABASE_URL : config.DATABASE_URL,
}