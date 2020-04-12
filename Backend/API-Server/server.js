var express = require('express');
var Validator = require('jsonschema').Validator;
var bodyParser = require('body-parser');
var sql = require('mysql'); // used for mySQL credentials
const https = require('https');
var fs = require('fs');
var cors = require('cors');
const config = require('./config/config.js');
var expJwt = require('express-jwt');
const argon2 = require('argon2');
const schemas = require('./schemas/schema.js');
var jwt = require('jsonwebtoken'); // will need for login only endpoints
const { gen_date } = require('./util.js');

var app = express();

const _port = 8080;


const cors_options = {
	origin: '*',
}


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(cors_options))

app.use(expJwt({ secret: config.JWT.Secret, credentialsRequired: false }));

var connection = sql.createConnection(config.sql_config);

var sql_queries = require('./queries.js');

var media = require('./routes/media.js')(connection);
var user = require('./routes/user.js')(connection);
var orders = require('./routes/orders.js')(connection);

// all media related endpoints
app.use('/api/media', media);
app.use('/api/user', user);
app.use('/api/orders', orders);



app.get('/api/uploads/:type/:id/:filename', async (req, res) => {
	const type = req.params['type']
	const id = req.params['id']
	const filename = req.params['filename']

	res.sendFile(__dirname + `/uploads/${type}/${id}/${filename}`);

})


app.post('/api/auth', async (req, res) => {
	const body = req.body;
	const token = await sql_queries.login_person(connection, body['username'], body['password']);
	res.send(token);
});

// TODO: DO SERVER SIDE VALIDATION
app.post('/api/register', async (req, res) => {
	var body = req.body;

	var JsonValidator = new Validator();
	var result = JsonValidator.validate(body, schemas.register_schema);

	connection.beginTransaction();

	try {
		if (result.errors.length > 0) {
			throw new Error(result.errors);
		}

		// hash the password given by the user to be put into the database
		const hash = await argon2.hash(body['password']);

		// actually register the account
		await sql_queries.register_account(
			connection,
			body['username'],
			hash,
			body['email'],
			body['first_name'],
			body['last_name'],
			body['birth_date'],
			body['account_level']
		);

		// get the last id from the last insert
		const id = await sql_queries.get_last_id(connection);

		switch (body['account_level']) {
			case 'Customer':
				await sql_queries.create_customer(connection, id, gen_date());
				break;
			case 'Employee':
				if (req.user.Account_Level === 'Employee') {
					await sql_queries.create_employee(connection, id, gen_date());
				} else {
					throw new Error('Unauthorized User');
				}
				break;
			default:
				throw new Error('Invalid Account Level');
		}
		// add any phone numbers
		await sql_queries.add_phone_numbers(connection, id, body['phoneNumbers']);

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
var privateKey = fs.readFileSync(__dirname+'/cred/api.key');
var certificate = fs.readFileSync(__dirname + '/cred/api.crt');

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
	connection.query('USE project_2');
});

app.use((err, req, res, next) => {
	console.log(err);
	if (err.name === 'UnauthorizedError') {
		console.log(err);
		res.sendStatus(401);
	} else {
		res.sendStatus(500);
	}
});
