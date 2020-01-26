
let mysql = require('mysql');

//커넥션 연결
let dbConfig = {
    host: "127.0.0.1",
    port: "3306",
    user: "root",
    password: "password",
    database: "test_db",
    multipleStatements : true,
    connectionLimit: 50
};

var pool = mysql.createPool(dbConfig);
module.exports = pool;