var app = require('express')();
var bodyParser = require('body-parser');
var sql = require('mysql'); 
var crypt = require("bcrypt");
const uuidv1 = require('uuid/v1');

// var expJwt = require("express-jwt");
// var jwt = require("jsonwebtoken");
// var cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var connection = sql.createConnection(config.sql_config);




app.get('/api/v1/games', (req, res) =>{
   


})


