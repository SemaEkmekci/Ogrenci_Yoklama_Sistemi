const dotenv = require('dotenv');
const asset = require('assert');
const { assert } = require('console');

dotenv.config();

const {PORT, HOST, HOST_URL, SQL_USER, SQL_PASSWORD, SQL_DATABASE, SQL_SERVER,SECRET} = process.env;

const sqlEncrypt = process.env.ENCRYPT === "true";

assert(PORT, 'PORT is required');
assert(HOST, 'HOST is required');

module.exports = {
    port: PORT,
    host: HOST,
    url: HOST_URL,
    sql:{
        server: HOST,
        database: SQL_DATABASE,
        user: SQL_USER,
        password: SQL_PASSWORD,
        options:{
            encrypt: sqlEncrypt,
            trustedConnection:true
        }
    },
    session:{
        secret: SECRET
    }
}