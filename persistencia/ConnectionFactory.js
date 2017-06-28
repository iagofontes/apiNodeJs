var mysql = require('mysql');

function createDBConnection(){
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'admin',
        database: 'nodeapi'
    });
}

module.exports = function(){
    return createDBConnection;
}