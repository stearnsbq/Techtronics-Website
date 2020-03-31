var express = require('express');
var Validator = require('jsonschema').Validator;
var bodyParser = require('body-parser');
var sql = require('mysql'); // used for mySQL credentials
const https = require('https');
var crypt = require('bcrypt'); // used for hashing passwords
var fs = require('fs');
const config = require('./config/config.js');
var expJwt = require('express-jwt');
const schemas = require('./schemas/schema.js');
var jwt = require('jsonwebtoken'); // will need for login only endpoints
const {hash_password, gen_date} = require('./util.js')

// var cors = require("cors");
var app = express();

const _port = 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(expJwt({secret: config.JWT.Secret ,credentialsRequired: false}))





var connection = sql.createConnection(config.sql_config);

var Queries = require('./queries.js')

var sql_queries = new Queries(connection);

app.get('/api/games', (req, res) => {
	connection.query(
		'SELECT Media.Name, Media.Platform, Media.User_rating, Media.Price, Media.Condition, Game.* FROM Game LEFT JOIN Media ON Media.Media_ID = Game.Game_ID',
		(err, results, fi) => {
			if (err) {
				res.send([]);
			} else {
				res.send(results);
			}
		}
	);
});

app.get('/api/software', (req, res) => {});

app.get('/api/hardware', (req, res) => {});

app.get('/api/video', (req, res) => {});

app.get('/api/specials', (req, res) => {
	connection.query('SELECT * FROM Specials', (err, results, fi) => {
		if (err) {
			res.send([]);
		} else {
			res.send(results);
		}
	});
});

app.get('/api/specials/:id', (req, res) => {
	connection.query(
		`SELECT * FROM Specials WHERE Specials.Special_ID=${connection.escape(req.params['id'])}`,
		(err, results, fi) => {
			if (err) {
				res.send([]);
			} else {
				res.send(results);
			}
		}
	);
});

app.post('/api/specials',   (req, res) => {});

app.post('/api/media', async (req, res) => {
	console.log(req.user)
	if(req.user.Account_Level !== 'Employee'){
		res.sendStatus(401);
		return;
	}

	const body = req.body;

	req.t

	var JsonValidator = new Validator();
	var result = JsonValidator.validate(body, schemas.register_schema);

		try{

			if (result.errors.length <= 0) {
				throw new Error(result.errors)
			}

			connection.beginTransaction();

			await sql_queries.add_new_media(body['name'], body['platform'], body['price'], body['condition'], body['mediaType'], body['mediaFields']);

			var id = await sql_queries.get_last_id();

			connection.commit();
			res.redirect(`./media/${id}`)
		}catch(err){
			console.log(err)
			connection.rollback();
			res.sendStatus(401);
		} 
});

app.get('/api/media', async (req, res) => {

	// send the result of the search back to the user
	res.send(!req.query['search'] ? await sql_queries.search() :  await sql_queries.search( connection.escape(`%${req.query['search']}%`)))
	
	
});

app.get('/api/media/:id', async (req, res) => {
	const id = req.params['id'];
	res.send(await sql_queries.get_media_by_id(id));
});



app.post('/api/auth', (req, res) => {
	const body = req.body;
	connection.query(
		`SELECT Password, Person_ID, Account_Level FROM Person WHERE Username=${connection.escape(body.username)}`,
		(err, results, fields) => {
			if (!err && results.length > 0) {
				// compare the password sent from the user and the hash in the database

				crypt.compare(body.password, results[0].Password, (err, result) => {
					if (result && !err) {
						var token = jwt.sign({ Person_ID: results[0].Person_ID, Account_Level: results[0].Account_Level }, config.JWT.Secret, { expiresIn: '7d' }); // send a JWT token for authentication
						res.send({ token: token }); // send the json containing th JWT back to the user
					} else {
						 // incorrect password
						 res.sendStatus(401);
					}
				});
			}else{
				// invalid username
				res.sendStatus(401);
			}
		}
	);
});

// TODO: DO SERVER SIDE VALIDATION
app.post('/api/register', async (req, res) => {
	var body = req.body;


	var JsonValidator = new Validator();
	var result = JsonValidator.validate(body, schemas.register_schema);



		connection.beginTransaction();

		try {
			if(result.errors.length > 0){
				throw new Error(result.errors)
			}

			// hash the password given by the user to be put into the database
			const hash = await hash_password(body['password']);


			// actually register the account
			await sql_queries.register_account(body['username'], hash, body['email'], body['first_name'], body['last_name'], body['birth_date'], body['account_level']);

			// get the last id from the last insert
			const id = await sql_queries.get_last_id();

			switch (body['account_level']){
				case 'Customer':
					await sql_queries.create_customer(id, gen_date())
					break;
				case 'Employee':
					await sql_queries.create_employee(id, gen_date())
					break;
				default:
					throw new Error("Invalid Account Level")
			}
			// add any phone numbers 
			await sql_queries.add_phone_numbers(id, body['phoneNumbers']);
			
			
			connection.commit();
			res.sendStatus(200);
		} catch (error) {
			console.log(error);
			connection.rollback();
			res.sendStatus(400);
		}

});









var httpsEnabled = false;

// private key and certificate for HTTPS
var privateKey = fs.readFileSync('c:/Users/quinn/Desktop/dev/CMSC508/Backend/API-Server/cred/api.key');
var certificate = fs.readFileSync('c:/Users/quinn/Desktop/dev/CMSC508/Backend/API-Server/cred/api.crt');

var credentials = { key: privateKey, cert: certificate };

if (httpsEnabled) {
	var server = https.createServer(credentials, app);
	server.listen(_port, () => {
		console.log('HTTPs Server running on port 8080');
	});
} else {
	app.listen(_port, () => {
		console.log('HTTP Server running on port 8080');
	});
}

connection.connect((err) => {
	if (err) throw err;
	console.log('Database connected!');
	connection.query('USE 508_PROJECT');
});

app.use((err, req, res, next) => {
	if (err.name === 'UnauthorizedError') {
		console.log(err)
	    res.sendStatus(401);
	}
});

