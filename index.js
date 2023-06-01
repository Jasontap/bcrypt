require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { client, createUser } = require('./DB');
const { PORT, SECRET } = process.env;

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use(async (req, res, next) => {
  const {rows} = await client.query('SELECT * FROM users;');
  console.log(rows);
  next();
})

app.post('/register', async (req, res, next) => {
  const saltRound = 10;
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRound);
  
  const storedUser = await createUser({username, password: hashedPassword});
  
  console.log(storedUser);
  
  const token = jwt.sign(storedUser, SECRET);
  
  res.send({token, message: 'Thanks for registering!'});
})

app.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  const isLoggedIn = await bcrypt.compare(password, currentRegisteredUser.password);
  
  res.send({isLoggedIn, registeredUser: currentRegisteredUser, user: req.body});
})

app.listen(PORT, async () => {
  await client.connect();
  console.log(`listening on port ${PORT}!`)
})


// two methods with bcrypt
// hash - hashes a plaintext password
// compare - compares a plaintext password with a hashed password
