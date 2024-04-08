const sql = require('mssql');
const config = require("../config");

const getConnection = async () => {
    try {
        const pool = await sql.connect(config.sql);
        console.log("SQL CONNECTED");
        return pool;
    } catch(err) {
        console.error(err);
    }
}

module.exports = { getConnection };
