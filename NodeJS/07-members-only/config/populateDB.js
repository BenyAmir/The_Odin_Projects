require("dotenv").config();
const pg = require("pg");

const SQL = `
    CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        firstName TEXT,
        lastName TEXT,
        username VARCHAR ( 255 ),
        password VARCHAR ( 255 ),
        membership BOOLEAN DEFAULT false,
        admin BOOLEAN DEFAULT false
);

    CREATE TABLE IF NOT EXISTS Posts (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        title VARCHAR ( 255 ),
        body TEXT,
        created TIMESTAMP,
        writer_id INTEGER REFERENCES Users(id)
)
`;

const populateDB = async () => {
  console.log("seeding...");
  try {
    const client = new pg.Client({
      connectionString: process.env.DB_CONNECTION,
    });

    await client.connect();
    await client.query(SQL);
    await client.end();
  } catch (error) {
    console.error(error);
  }
};

populateDB()
// module.exports = {
//   populateDB,
// };
