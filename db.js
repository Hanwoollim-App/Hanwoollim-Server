const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost', 
    user: 'root',
    password: 'Hanwol2513671@whyremydel1@',
    database: 'hanwoolimserver',
});

module.exports = pool;