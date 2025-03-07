const {Pool} = require('pg')

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "users_db",
    password: "postgres",
    port: 5432
})

pool.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch(error => console.error("Connection error: ", error))

module.exports = pool