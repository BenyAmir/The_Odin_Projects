import pg from "pg";

const SQL = `
    CREATE TABLE IF NOT EXISTS Genre (
        genre_id SERIAL PRIMARY KEY,
        name text
    );
    CREATE TABLE IF NOT EXISTS Game (
        game_id SERIAL PRIMARY KEY,
        name text,
        year timestamp,
        rate float,
        genre_id integer REFERENCES Genre(genre_id)
    );
    CREATE TABLE IF NOT EXISTS Developer (
        developer_id SERIAL PRIMARY KEY,
        name text,
        age int
    );
    CREATE TABLE IF NOT EXISTS Creator (
        developer_id int REFERENCES Developer(developer_id) ON DELETE CASCADE,
        game_id int REFERENCES Game(game_id) ON DELETE CASCADE,
        PRIMARY KEY (developer_id,game_id)
    );
`;

export const main = async () => {
  console.log("seeding...");
  console.log('con for client; ',process.env.CONNECTION_STRING)

  try {
    const client = new pg.Client({
      connectionString: process.env.CONNECTION_STRING,
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
  } catch (error) {
    console.log("err:", error);
  }
};
