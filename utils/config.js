require('dotenv').config();

const {
  PORT, MONGO_URL, NODE_ENV,
} = process.env;

const DB_URL = NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/newsdb';
const APP_PORT = NODE_ENV === 'production' ? PORT : 3001;

const DB_CONFIG = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

module.exports = {
  APP_PORT, DB_URL, DB_CONFIG,
};
