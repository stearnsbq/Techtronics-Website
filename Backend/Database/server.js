var app = require('express')();
var Validator = require('jsonschema').Validator;
var bodyParser = require('body-parser');
var sql = require('mysql');   // used for mySQL credentials
const https = require('https');
var crypt = require("bcrypt");   // used for hashing passwords
var fs = require('fs');
const config = require('./config/config.js')
var expJwt = require("express-jwt");
const schemas = require('./schemas/schema.js')
var jwt = require("jsonwebtoken");   // will need for login only endpoints
// var cors = require("cors");


var httpsEnabled = false;

// private key and certificate for HTTPS
var privateKey = fs.readFileSync('./cred/api.key');
var certificate = fs.readFileSync('./cred/api.crt');

var credentials = {key: privateKey, cert: certificate}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var connection = sql.createConnection(config.sql_config);





app.get('/api/games', (req, res) =>{
   // return data on all games in the inventory / database I might drop this end point though

})

app.get('/api/hardware', (req, res) =>{
   
 // return data on all hardware in the inventory / database I might drop this end point though

})

app.get('/api/search', (req, res) =>{
   
    res.send(`Hello! you searched: ${req.query['query']}`)   /// in general this endpoint should send all of the entities in the database that meet the search query

})

app.post('/api/auth', (req, res) =>{
    const body = req.body

    connection.query(`SELECT Password FROM Person WHERE Username=${connection.escape(body.username)}`, (err, results, fields) =>{
        crypt.compare(body.password, results[0].Password,  (err, result) =>{
            if(err) throw err
            if(result){
                var token = jwt.sign({}, "TEMP_SECRET", { expiresIn: "7d" }) // send a JWT token for authentication
                res.send({ token: token }); // token
            }else{
                res.sendStatus(401); // send 401 unauthorized
            }
        })
    })
})


app.post("/api/register", (req, res) =>{

    var body = req.body

    var JsonValidator = new Validator();
    var result = JsonValidator.validate(body, schemas.register_schema);
    
    if (result.errors.length <= 0) {

        crypt.hash(body.Password, 10, (err, hash) => {
            if (err){
                res.sendStatus(500); 
            }else{
                if (hash){
                 
                    new Promise(async (resolve, reject) => {

                        connection.beginTransaction(); // begin  transaction as I want to insert into multiple tables

                        connection.query(`INSERT INTO Person (Username, Password, Email, First_name, Last_name, Birth_date) VALUES (${sql.escape(body.Username)}, ${sql.escape(hash)}, ${sql.escape(body.Email)}, ${sql.escape(body.First_name)}, ${sql.escape(body.Last_name)}, ${sql.escape(body.Birth_date)})` , (err, results, fields) =>{
                            if (err){
                                return reject(err);
                            }
                        })

                        connection.query("SELECT LAST_INSERT_ID() AS 'ID'", (err, results, fields) =>{
                            if (err){
                                return reject(err);
                            }else{
                                var id = results[0]['ID'];

                               if (body['account_level'] === 'Customer'){

                                const now = new Date();
    
                                const date = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`
    
                                connection.query(`INSERT INTO Customer (Customer_ID, Registration_Date) VALUES (?, ?)`, [id, date] , (err, results, fields) =>{
                                    if (err){
                                        return reject(err);
                                    }
                                })
    
    
                            }else if(body['account_level'] === 'Employee'){
    
                                const now = new Date();
    
                                var date = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`
    
                                connection.query(`INSERT INTO Employee (Employee_ID, Hire_date) VALUES (?, ?)`, [id, date] ,(err, results, fields) =>{
                                    if (err){
                                        return reject(err);
                                    }
                                })
    
                            }
    
                                body.phoneNumbers.forEach(element => {
                                    connection.query(`INSERT INTO Phone_numbers (Person_ID, Phone_number) VALUES (${id}, ${connection.escape(element)})`, (err, results, fields) =>{
                                        if (err){
                                            return reject(err);
                                        }
                                    })
                                });

                                return resolve(true);
                            }
                        })


    }).then(result => {
        console.log(result)
        res.sendStatus(200);
        connection.commit();
    }, err => {
        console.log(err.sqlMessage)
        res.sendStatus(400);
        connection.rollback();
    })
                }else{
                    res.sendStatus(400);
                }
            }
        })
    }

})






if(httpsEnabled){
    var server = https.createServer(credentials, app);
    server.listen(8080, ()=>{
        console.log("Https Server running on port 8080");
    });
}else{
    app.listen(8080, ()=>{
        console.log("Http Server running on port 8080");
    })
}


connection.connect(err => {
    if (err) throw err;
    console.log("Database connected!")
    connection.query("USE 508_PROJECT");
})

