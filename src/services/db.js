const mysql = require('mysql2/promise');
require('dotenv').config();

const createUnixSocketPool = async config => {
  return mysql.createPool({
    //host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    socketPath: process.env.INSTANCE_UNIX_SOCKET,
  });
};

let pool;
(async () => {
    pool = await createUnixSocketPool();
})();

module.exports = pool;
