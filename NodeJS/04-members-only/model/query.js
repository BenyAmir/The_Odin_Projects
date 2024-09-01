const Pool = require("../config/database");

async function getAllUsers() {
  const { rows } = await Pool.query("SELECT * FROM Users");
  return rows;
}

async function getUserByID(id) {
  const { rows } = await Pool.query("SELECT * FROM Users WHERE id = $1", [id]);
  return rows[0];
}

async function getUserByEmail(email) {
  const { rows } = await Pool.query("SELECT * FROM Users WHERE username = $1", [
    email,
  ]);
  return rows[0];
}

async function insertUser(user) {
    const {firstName,lastName,userName,password,admin} = user;
    return Pool.query('INSERT INTO Users (firstName,lastName,userName,password,admin) VALUES ($1,$2,$3,$4,$5)',[firstName,lastName,userName,password,admin])
}



// BLOG SECTION

async function getAllPosts() {
  const { rows } = await Pool.query("SELECT p.title,p.body,p.created,p.id,u.firstname,u.lastname from posts as p join users as u on p.writer_id = u.id;");
  return rows;
}

async function addBlog(blog){
  const {title,body,created,writer_id} = blog;
  return Pool.query('INSERT INTO Posts (title,body,created,writer_id) VALUES ($1,$2,$3,$4)',[title,body,created,writer_id])
}

async function deleteBlog(id){
  return Pool.query('DELETE FROM Posts WHERE id = $1',[id])
}

// MEMBERSHIP

async function updateMembership(id){
  return Pool.query('UPDATE Users SET membership = true where id = $1',[id])
}

module.exports = {
  getAllUsers,
  getUserByEmail,
  getUserByID,
  getAllPosts,
  insertUser,
  addBlog,
  updateMembership,
  deleteBlog
};
