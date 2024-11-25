require('dotenv').config() // Load .env variables

module.exports = {
    development: {
        username: process.env.DB_USERNAME || 'Zaedriel',
        password: process.env.DB_PASSWORD || 'jme6vzx0kgh7gpd_EQH',
        database: process.env.DB_NAME || 'theListDB',
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
    },
    test: {
        username: process.env.TEST_DB_USERNAME || 'default_test_username',
        password: process.env.TEST_DB_PASSWORD || 'default_test_password',
        database: process.env.TEST_DB_NAME || 'default_test_database',
        host: process.env.TEST_DB_HOST || '127.0.0.1',
        port: process.env.TEST_DB_PORT || 5432,
        dialect: 'postgres',
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
    },
}