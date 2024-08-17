import pool from "./pool.js";

// game queries
export async function GetAllGames() {
  const { rows } = await pool.query("SELECT * FROM Game");
  return rows;
}

export async function GetGameById(id) {
  const { rows } = await pool.query("SELECT * FROM Game WHERE game_id = $1",[id]);
  return rows[0];
}

export async function InsertNewGame(value) {
  const { name, year, rate, genre_id } = value;
  console.log(value);
//   const timespan = new Date(year).getTime();
  return pool.query(
    `INSERT INTO Game (name, year, rate, genre_id) values ($1,$2,$3,$4)`,[name, new Date(year).toISOString(), rate, genre_id]
  );
}

export async function UpdateGame(value) {
  const { game_id, name, year, rate , genre_id, developer_id } = value;
  for(const dev_id of developer_id){
    await pool.query("INSERT INTO Creator (game_id,developer_id) VALUES ($1,$2) ON CONFLICT (developer_id,game_id) DO NOTHING",[game_id,dev_id]);
  }

  return pool.query(
    "UPDATE Game SET name = $1, year = $2, rate = $3, genre_id = $4 WHERE game_id = $5",
    [name, year, rate, genre_id, game_id]
  );
}

export async function DeleteGame(id) {
  return pool.query("Delete FROM Game WHERE game_id = $1", [id]);
}

// developer queries
export async function GetAllDevelopers() {
  const { rows } = await pool.query("SELECT * FROM Developer");
  return rows;
}

export async function GetDeveloperById(id) {
  const { rows } = await pool.query("SELECT * FROM Developer WHERE developer_id = $1",[id]);
  return rows[0];
}

export async function InsertNewDeveloper(value) {
  const { name,age } = value;
  return pool.query("INSERT INTO Developer (name,age) values ($1,$2) RETURNING developer_id", [name,age]);
}

export async function InsertCreator(value){
  const {game_id,developer_id} = value;
  return pool.query('INSERT INTO Creator (game_id,developer_id) VALUES ($1,$2)',[game_id,developer_id])
}

export async function UpdateDeveloper(value) {
  const { developer_id,age, name, game_id } = value;
  for (const id of game_id){
    await pool.query("INSERT INTO Creator (game_id,developer_id) VALUES ($1,$2) ON CONFLICT (game_id,developer_id) DO NOTHING",[id,developer_id])
  }

  return pool.query("UPDATE Developer SET name = $1, age = $2 WHERE developer_id = $3", [
    name,
    age,
    developer_id,
  ]);
}

export async function DeleteDeveloper(id) {
  return pool.query("Delete FROM Developer WHERE developer_id = $1", [id]);
}

// genre queries

export async function GetAllGenres() {
  const { rows } = await pool.query("SELECT * FROM Genre");
  return rows;
}

export async function GetGenreById(id) {
  const { rows } = await pool.query("SELECT * FROM Genre WHERE genre_id = $1",[id]);
  return rows[0];
}

export async function InsertNewGenre(value) {
  const { name } = value;
  return pool.query("INSERT INTO Genre (name) values ($1)", [name]);
}

export async function UpdateGenre(value) {
  const { genre_id, name } = value;
  return pool.query("UPDATE Genre SET name = $1 WHERE genre_id = $2", [
    name,
    genre_id,
  ]);
}

export async function DeleteGenre(id) {
  return pool.query("Delete FROM Genre WHERE genre_id = $1", [id]);
}

// Creators
export async function GetAllCreators() {
    const {rows} = await pool.query(`
      SELECT developer.name as director,game.game_id,genre.name as genre FROM Creator 
      JOIN Developer ON Creator.developer_id = Developer.developer_id
      JOIN Game ON Game.game_id = Creator.game_id
      JOIN Genre ON Genre.genre_id = Game.genre_id
      `);
      return rows;
}

export async function GetCreatorByGame(game_id) {
  const {rows} = await pool.query(`
    SELECT Creator.developer_id as director FROM Creator 
    JOIN Game ON Creator.game_id = Game.game_id
    WHERE Creator.game_id = $1`
    , [game_id]);
  return rows
}

export async function GetCreatorByDeveloper(developer_id){
  const {rows} = await pool.query(`
    SELECT creator.game_id as game FROM Creator
    JOIN Developer ON Creator.developer_id = Developer.developer_id
    WHERE Creator.developer_id = $1
    `,[developer_id]);
    return rows
}
