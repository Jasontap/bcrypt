require('dotenv').config();
const { Client } = require('pg');

const connection_string = process.env.DATABASE_URL;

console.log("CONNECTIONG STRING=============", connection_string)

const client = new Client(connection_string);

// Database adapters

// create user
async function createUser(user) {
  const { username, password } = user;
  try {
    const {rows: [createdUser]} = await client.query(`
      INSERT INTO users (username, password) 
      VALUES ($1, $2)
      RETURNING *;
    `, [username, password]);
    
    delete createdUser.password;
    return createdUser; // => {id, username}
  } catch(ex) {
    // do someting with the error/exception
  }
  
}


module.exports = {
  client,
  createUser
}
