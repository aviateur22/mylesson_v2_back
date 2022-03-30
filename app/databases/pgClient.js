const { Pool } = require('pg');

const config = {};
config.connectionString = process.env.DATABASE_URL;
/**la variable NODE_ENV est inclue dans HEROKU */
if(process.env.NODE_ENV === 'production') {
    console.log( `database.js - ENV: production - DATABASE: ${process.env.DATABASE_URL}`);
    config.ssl = {
        rejectUnauthorized: false,
    };
} else {
    console.log( `database.js - ENV: DEV - DATABASE: ${process.env.DATABASE_URL}`);      
}

const pool = new Pool(config);
module.exports = pool;