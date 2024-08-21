const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "company_db",
  password: "Elisse24!",
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
