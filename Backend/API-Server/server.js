var express = require('express');
var Validator = require('jsonschema').Validator;
var bodyParser = require('body-parser');
var sql = require('mysql'); // used for mySQL credentials
const https = require('https');
var fs = require('fs');
var cors = require('cors');
const config = require('./config/config.js');
const argon2 = require('argon2');
const schemas = require('./schemas/schema.js');
var jwt = require('jsonwebtoken'); // will need for login only endpoints
const { gen_date } = require('./util.js');
var multer  = require('multer')
var {v1} = require('uuid')
var nodemailer = require("nodemailer");
var util = require("./util.js")
var expJwt = require('express-jwt');



var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: config.email.username,
        pass: config.email.password
    }
});


var app = express();

const _port = 8081;


const cors_options = {
	origin: '*',
}




var storage = multer.diskStorage({
	destination: function (req, file, cb) {
	 const path = __dirname + '/uploads/media/'+ req.body.media;

	  if(!fs.existsSync(path)){
		  fs.mkdirSync(path);
	  }

	  cb(null, path)
	},
	filename: function (req, file, cb) {
	  cb(null, v1() + '.' + file.originalname.split('.')[1])
	}
  })


var upload = multer({ storage: storage })



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(cors_options))

var connection = sql.createConnection(config.sql_config);

var sql_queries = require('./queries.js'); 

var media = require('./routes/media.js')(connection, upload);
var user = require('./routes/user.js')(connection);
var orders = require('./routes/orders.js')(connection);
var companies = require('./routes/companies.js')(connection);

// all media related endpoints
app.use('/api/media', media);

// all user related endpoints
app.use('/api/user', user);

// all order related endpoints
app.use('/api/orders', orders);

// all company related endpoints 
app.use('/api/companies', companies);


app.post('/api/resetpassword', expJwt({secret: config.JWT.Secret}), async (req, res)=>{
	try{
		const email = req.user.email;

		if(email){

			const hash = await argon2.hash(req.body['password'])

			await sql_queries.reset_password(connection, hash, email);
	
			res.send({"result": "success"});

		}else{
			res.send(401);
		}
		
	}catch(error){
		res.sendStatus(400);
	}

})

app.get('/api/forgotpassword', async(req, res) =>{
	try{
		const email = req.query.email;

		if(email){

			
		const token = Math.floor((Math.random() * 100000) + 50000);

		// add it into the database
		await sql_queries.add_new_forgot_password_verification(connection, email, token)

		const emailLink = `http://localhost:4200/forgotpassword?token=${token}&email=${email}`

		const mailOptions = {
			to: email,
			subject: "Password Reset",
			html : `Hello,<br> Please Click on the link to reset your password.<br><a href="${emailLink}">Click here to reset password</a>`
		}


		// send the email
		await util.mail(smtpTransport, mailOptions);

		res.sendStatus(200)

		}else{
			res.sendStatus(400)
		}


	}catch(error){
		console.log(error)
		res.sendStatus(400)
	}
})

app.get('/api/verifyforgotpassword', async (req, res) => {
	try{
		const email = req.query['email'];
		const token = req.query['token'];

		if(email && token){

			await sql_queries.verify_forgot_password(connection, email, token);


			var reset_token = jwt.sign(
				{email: email, token: token},
				config.JWT.Secret,
				{ expiresIn: '30m' }
			); // send a JWT token for authentication

			res.send({result: "success", 'reset-token': reset_token})
		}else{
			res.sendStatus(400);
		}

	}catch(error){
		console.log(error)
		if(error === "Expired"){
			res.send({result: "failed", reason: "Expired"})
		}else if (error === "Not Found"){
			res.send({result: "failed", reason: "Not Found"})
		}else{
			res.send({result: "failed", reason: "general error"})
		}
	}
});





app.get('/api/uploads/:type/:id/:filename', async (req, res) => { 
	const type = req.params['type']
	const id = req.params['id']
	const filename = req.params['filename']

	res.sendFile(__dirname + `/uploads/${type}/${id}/${filename}`);

})


app.get('/api/verify', async (req, res) =>{
	const email = req.query['email'];
	const token = req.query['token'];

	try{
		if(email && token){

			await sql_queries.verify_email(connection, email, token);

			await sql_queries.set_verified(connection, email);

			res.send({result: "success"})
		}else{
			res.sendStatus(400);
		}
	}catch(error){
		if(error === "Expired"){
			res.send({result: "failed", reason: "Expired"})
		}else if (error === "Not Found"){
			res.send({result: "failed", reason: "Not Found"})
		}else{
			res.send({result: "failed", reason: "general error"})
		}
	}


})


app.post('/api/auth', async (req, res) => {
	try{
		const body = req.body;
		const token = await sql_queries.login_person(connection, body['username'], body['password']);
		res.send(token);
	}catch(err){
		res.sendStatus(401);
	}

});

app.post('/api/register', expJwt({secret: config.JWT.Secret, credentialsRequired: false}),  async (req, res) => {
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
				await sql_queries.create_customer(connection, id);
				break;
			case 'Employee':
				if (req.user && (req.user.Account_Level === 'Employee' && req.user.Employee_Role === 'Manager')) {
					await sql_queries.create_employee(connection, id, body['employee_role']);
				} else {
					throw new Error('UnauthorizedError');
				}
				break;
			default:
				throw new Error('UnauthorizedError');
		}
		// add any phone numbers
		await sql_queries.add_phone_numbers(connection, id, body['phoneNumbers']);


		// generate a new token to verification
		const token = Math.floor((Math.random() * 100000) + 50000);

		// add it into the database
		await sql_queries._add_new_verification(connection, body['email'], token)


		// build the email link
		const emailLink = `http://3.234.246.29/~project_2/verify?token=${token}&email=${body.email}`

		const mailOptions = {
			to: body['email'],
			subject: "Please confirm your Email",
			html : `Hello,<br> Please Click on the link to verify your email.<br><a href="${emailLink}">Click here to verify</a>`
		}


		// send the email
		await util.mail(smtpTransport, mailOptions);

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
		console.log('HTTPS Server running on port 8080');
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
