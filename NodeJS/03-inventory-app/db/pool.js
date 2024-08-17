import 'dotenv/config';
import pg from 'pg';

console.log('con for pool; ',process.env.CONNECTION_STRING)
export default new pg.Pool({
    // connectionString: "postgresql://postgres:admin@localhost:5432/inventory"
    connectionString: process.env.CONNECTION_STRING
})