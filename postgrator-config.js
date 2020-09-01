require('dotenv').config();

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "connectionString": (process.env.DB_URL === 'test') ? process.env.TEST_DATABASE_URL : process.env.TEST_DATABASE_URL,
}