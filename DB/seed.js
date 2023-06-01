const { client, createUser } = require('./');

const users = [
  {
    username: 'Jason',
    password: 'jason123'
  },
  {
    username: 'Tommy',
    password: 'tommy123'
  }
]

const buildDB = async() => {
  try {
    console.log('connecting to DB')
    await client.connect();
    // drop tables first
    console.log('dropping tables')
    await client.query(`
      DROP TABLE IF EXISTS users;
    `)
    // create tables (users)
    console.log('creating tables')
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `)
    // create initial users
    console.log('creating initial users')
    await Promise.all(users.map(user => createUser(user)))
    
    const {rows} = await client.query(`SELECT * FROM users;`);
    console.log(rows)
    
    console.log('FINISHED SEEDING DB')
    await client.end();
  } catch(ex) {
    // do something with the error
    console.log(ex)
  }
}

buildDB();
