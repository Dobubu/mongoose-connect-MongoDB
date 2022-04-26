const mongoose = require('mongoose');

require('dotenv').config();

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB)
  .then(() => console.log('db connect success'))
  .catch(e => console.log(e));