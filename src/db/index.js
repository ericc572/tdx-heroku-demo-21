const { Pool } = require('pg')
const connectionString = process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === 'production'

console.log("connected to db", connectionString);

const pool = new Pool({
  connectionString,
  ssl: isProduction
})

module.exports = {
  query: (text, params) => pool.query(text, params),
}