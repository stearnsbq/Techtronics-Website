var express = require('express')();
var bodyParser = require('body-parser');
var sql = require('mysql');   // used for mySQL credentials
const https = require('https');
var database = require("./test_data.js")
var crypt = require("bcrypt");   // used for hashing passwords
var fs = require('fs');
var expJwt = require("express-jwt");
var jwt = require("jsonwebtoken");   // will need for login only endpoints
// var cors = require("cors");


// private key and certificate for HTTPS
var privateKey = fs.readFileSync('./cred/api.key');
var certificate = fs.readFileSync('./cred/api.crt');



var credentials = {key: privateKey, cert: certificate}

var server = https.createServer(credentials, app);


var app = express.createServer();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//var connection = sql.createConnection(config.sql_config);

app.get('/api/games', (req, res) =>{
   // return data on all games in the inventory / database I might drop this end point though

})

app.get('/api/hardware', (req, res) =>{
   
 // return data on all hardware in the inventory / database I might drop this end point though

})

app.get('/api/search', (req, res) =>{
   
    res.send(`Hello! you searched: ${req.query['query']}`)   /// in general this endpoint should send all of the entities in the database that meet the search query

})

app.get('/api/auth', (req, res) =>{
    const body = req.body
    crypt.compare(body.password, database[body.username],  (err, result) =>{
        if(result){
            var token = jwt.sign({}, "TEMP_SECRET", { expiresIn: "1d" }) // send a JWT token for authentication
            res.send({ token: token }); // token
        }else{
            res.sendStatus(401); // send 401 unauthorized
        }
    })
})

app.get('/api/v1/user/:username', expJwt({ secret: "TEMP_SECRET" }), (req, res) =>{
    //return all data about the user if the requestee has required permissions
})

app.post("/api/v1/register", (req, res) =>{

    const body = req.body

    crypt.genSalt(10, (err, salt) => {

        crypt.hash(body.password, salt, (err, hash) => {
            if (hash){
                // in general just add the new account to the database and use username as the primary key
                res.sendStatus(200);
            }else{
                res.sendStatus(500);
            }
           
        })

    })


})







server.listen(8080, ()=>{
    console.log("Server running on port 8080");
});