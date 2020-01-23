var app = require('express')();
var bodyParser = require('body-parser');
var sql = require('mysql');   //
var database = require("./test_data.js")
//var crypt = require("bcrypt");   // used for hashing passwords

var expJwt = require("express-jwt");
var jwt = require("jsonwebtoken");   // will need for login only endpoints
// var cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//var connection = sql.createConnection(config.sql_config);

app.get('/api/v1/games', (req, res) =>{
   res.send(database.games)
  

})

app.get('/api/v1/hardware', (req, res) =>{
   


})

app.get('/api/v1/search', (req, res) =>{
   
    res.send(`Hello! you searched: ${req.query['query']}`)

})

app.get('/api/v1/login', (req, res) =>{
   


})







app.listen(8080);