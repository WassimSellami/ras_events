const mysql = require('mysql')
const util = require('util')
const dotenv = require('dotenv');

dotenv.config();

// Data base connection 
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
})

const  query = util.promisify(con.query).bind(con)
//This export query variable
module.exports = query

