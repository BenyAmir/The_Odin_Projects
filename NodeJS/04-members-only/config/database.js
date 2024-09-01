require('dotenv').config();
const pg = require('pg');

const Pool = new pg.Pool({
    connectionString: process.env.DB_CONNECTION
})

module.exports = Pool;