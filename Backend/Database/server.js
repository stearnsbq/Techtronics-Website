var app = require('express')();
var bodyParser = require('body-parser');
var sql = require('mysql');   //
var database = require("./test_data.js")
var crypt = require("bcrypt");   // used for hashing passwords

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

app.get('/api/v1/auth', (req, res) =>{
    const body = req.body
    crypt.compare(body.password, database[body.username],  (err, result) =>{
        if(result){
            var token = jwt.sign({}, "TEMP_SECRET", { expiresIn: "1d" })
            res.send({ token: token });
        }else{
            res.sendStatus(401);
        }
    })
})

app.get('/api/v1/users', (req, res) =>{
    res.send(database.users)
})

app.post("/api/v1/register", (req, res) =>{

    const body = req.body

    crypt.genSalt(10, (err, salt) => {

        crypt.hash(body.password, salt, (err, hash) => {
            if (hash){
                database.users[body.username] = hash
                console.log(database)
                res.sendStatus(200);
            }else{
                res.sendStatus(500);
                console.log(err)
            }
           
        })

    })


})







app.listen(8080);