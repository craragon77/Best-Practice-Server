module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL:  process.env.DATABASE_URL || 'postgresql://CRA@localhost/Best-Practice-DB',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://CRA@localhost/Best-Practice-DB-Test',
    JWT_SECRET: process.env.JWT_SECRET || 'its a secret'
}