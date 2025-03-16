const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    user: "admin",
    host: "localhost",
    database: "hardwaredb",
    password: "admin@root",
    port: 3306
})

module.exports = pool