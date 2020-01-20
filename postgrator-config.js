require('dotenv').config();

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "connectionString": process.env.DATABASE_URL, //change this to DATABASE_URL
  "ssl": !!process.env.SSL,
}