var express = require('express');
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
var app = express();

const _port = 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



var connection = sql.createConnection(config.sql_config);

app.get('/api/games', (req, res) =>{
    connection.query('SELECT Media.Name, Media.Platform, Media.User_rating, Media.Price, Media.Condition, Game.* FROM Game LEFT JOIN Media ON Media.Media_ID = Game.Game_ID', (err, results, fi) => {
        if(err){
            res.send([]);
        }else{
            res.send(results)
         }
    })
})

app.get('/api/software', (req, res) =>{
 })
 

app.get('/api/hardware', (req, res) =>{
   
})

app.get('/api/video', (req, res) =>{
   
})

app.get('/api/specials', (req, res) =>{
    connection.query('SELECT * FROM Specials', (err, results, fi) => {
        if(err){
            res.send([]);
        }else{
            res.send(results)
         }
    })
});

app.get('/api/specials/:id', (req, res) =>{
    connection.query(`SELECT * FROM Specials WHERE Specials.Special_ID=${connection.escape(req.params['id'])}`, (err, results, fi) => {
        if(err){
            res.send([]);
        }else{
            res.send(results)
         }
    })
});


app.post('/api/specials', (req, res) =>{
    
    
});

app.post('/api/media', (req, res) => {




});



app.get('/api/search', (req, res) =>{
    const keys = Object.keys(req.query);

    if(req.query['media'] === 'all'){ // if the query was for all media


        new Promise((resolve, reject) => {

            // Get all of the media in the database
            connection.query(`SELECT Media_ID, Name, Platform, User_rating, Price, \`Condition\`, Game.Genre, ESRB_Rating, Hardware.Type, Video.Genre, MPAA_Rating, Software.Type FROM Media LEFT JOIN Video ON Video.Video_ID=Media.Media_ID LEFT JOIN Software ON Software.Software_ID=Media.Media_ID LEFT JOIN Game ON Game.Game_ID=Media.Media_ID LEFT JOIN Hardware ON Hardware.Hardware_ID=Media.Media_ID LEFT JOIN Media_Companies ON Media_Companies.Media=Media.Media_ID;`,  (err, allMedia, fi) => {
                var send = []
                if(!err){
                    for(const result of allMedia){
                        var tmp = {}
                        for(const prop in result){
                            if(result[prop]){
                                tmp[prop] = result[prop]
                            }
                        }
                        send.push(tmp)
                    }
                    // we got the data resolve the promise


                    return resolve(send);
                }else{
                    // some error reject the promise
                    return reject(err);
                }            
            })


        }).then(trimmedMedia => {
      

    
                // get all of the DLCs for a given Game
                connection.query("SELECT DLC_ID, DLC.Game_ID, Name, Price FROM Game JOIN DLC ON DLC.Game_ID=Game.Game_ID JOIN Media ON DLC.DLC_ID = Media.Media_ID", (err, DLCs, fi) =>{

                    if(!err){

                        // create a new DLC array for a game if the game as DLC
                        for(var DLC of DLCs){
                            trimmedMedia.forEach(element => {
                                if(element['Media_ID'] === DLC['Game_ID']){
                                    if(!element['DLC']){
                                        element['DLC'] = []
                                    }

                                    element['DLC'].push(DLC);
                                }
                            })
                         
                        }
                        res.send(trimmedMedia);
                    }
                })

            
      
        })

    }else{

        // calls a search procedure to search by the given field

        connection.query(`CALL search('${req.query['media']}', '${keys[1]}', '${req.query[keys[1]]}')`, (err, results, fi) => {
            if(err){
                res.send([]);
            }else{
                res.send(results[0])
             }
        })
    }
})


app.post('/api/auth', (req, res) =>{
    const body = req.body
    connection.query(`SELECT Password, Person_ID FROM Person WHERE Username=${connection.escape(body.Username)}`, (err, results, fields) =>{
        if(err){
            console.log(err)
        }else{
            console.log(results[0])
            crypt.compare(body.Password, results[0].Password,  (err, result) =>{
                if(result && !err){
                    var token = jwt.sign({ID: results[0].Person_ID}, config.JWT.Secret, { expiresIn: "7d" }) // send a JWT token for authentication
                    res.send({ token: token }); // token
                }else{
                    res.sendStatus(401); // incorrect password
                }
            })

        }
    })
})



// TODO: DO SERVER SIDE VALIDATION
app.post("/api/register", (req, res) =>{

    var body = req.body

    var JsonValidator = new Validator();
    var result = JsonValidator.validate(body, schemas.register_schema);
    
    if (result.errors.length <= 0) {

        crypt.hash(body.Password, 10, (err, hash) => { // hash the password with 10 salt rounds
            if (err){
                res.sendStatus(500); // some hashing error at the fault of the server not the user
            }else{
                if (hash){ // make sure hash exists
                 
                    new Promise(async (resolve, reject) => {  // use a promise so I can handle errors inside of callbacks
                        
                        // generate a sql compliant date
                        function genDate(){
                            const now = new Date();
    
                            return `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`
                        }

                        connection.beginTransaction(); 

                        connection.query(`INSERT INTO Person (Username, Password, Email, First_name, Last_name, Birth_date) VALUES (${sql.escape(body.Username)}, ${sql.escape(hash)}, ${sql.escape(body.Email)}, ${sql.escape(body.First_name)}, ${sql.escape(body.Last_name)}, ${sql.escape(body.Birth_date)})` , (err, results, fields) =>{
                            if (err){
                                return reject(err);
                            }
                        })


                        connection.query("SELECT LAST_INSERT_ID() AS 'ID'", (err, results, fields) =>{ // get id for the last insert 
                            if (err){
                                return reject(err);
                            }else{
                                var id = results[0]['ID']; // get the id from the results

                               if (body['account_level'] === 'Customer'){

    
                                connection.query(`INSERT INTO Customer (Customer_ID, Registration_Date) VALUES (?, ?)`, [id, genDate()] , (err, results, fields) =>{ // insert the person into the customer table
                                    if (err){
                                        return reject(err);
                                    }
                                })
    
    
                            }else if(body['account_level'] === 'Employee'){

                                connection.query(`INSERT INTO Employee (Employee_ID, Hire_date) VALUES (?, ?)`, [id, genDate()] ,(err, results, fields) =>{ // insert the person into the employee table
                                    if (err){
                                        return reject(err);
                                    }
                                })
    
                            }
    
                                body.phoneNumbers.forEach(element => {
                                    connection.query(`INSERT INTO Phone_numbers (Person_ID, Phone_number) VALUES (${id}, ${connection.escape(element)})`, (err, results, fields) =>{ // insert all phone_numbers for a person into the phone_numbers table
                                        if (err){ 
                                            return reject(err);
                                        }
                                    })
                                });

                                return resolve();
                            }
                        })


    }).then(result => {
        res.sendStatus(200);
        connection.commit();
    }, err => {
        console.log(err.sqlMessage)
        res.sendStatus(401);
        connection.rollback();
    })
                }else{
                    res.sendStatus(400);
                }
            }
        })
    }

})


var httpsEnabled = false;

// private key and certificate for HTTPS
var privateKey = fs.readFileSync('./cred/api.key');
var certificate = fs.readFileSync('./cred/api.crt');

var credentials = {key: privateKey, cert: certificate}

if(httpsEnabled){
    var server = https.createServer(credentials, app);
    server.listen(_port, ()=>{
        console.log("HTTPs Server running on port 8080");
    });
}else{
    app.listen(_port, ()=>{
        console.log("HTTP Server running on port 8080");
    })
}


connection.connect(err => {
    if (err) throw err;
    console.log("Database connected!")
    connection.query("USE 508_PROJECT");
})

