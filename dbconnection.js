let mysql = require("mysql");

exports.dbs = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"4d_hrms"
});
