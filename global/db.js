const mysql = require('mysql');
const conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'hermes',
    port : 3306,
    database : 'hermes'
});

conn.connect((err) => {
    if(err){
        throw err;
    }
});

module.exports = conn;