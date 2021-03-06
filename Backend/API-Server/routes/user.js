module.exports = function(connection) {
	var express = require('express');
	var router = express.Router();
	var Validator = require('jsonschema').Validator;
	var sql_queries = require('../queries.js');
	const config = require('../config/config.js');
	var expJwt = require('express-jwt');

	router.get('/', expJwt({ secret: config.JWT.Secret}), async (req, res) => {
		var Person_ID = req.user.Person_ID;
		
		var user = await sql_queries.get_user_info(connection, Person_ID);

		res.send(user);
	});



	router.get('/validate', async (req, res) => {
		try{
			const email = req.query['email'];

			if(email){
				const isValid = await sql_queries.validate_email(connection, email);

				res.send({'result': "success", "isValid": isValid})
			}else{
				res.sendStatus(400);
			}

		}catch(err){
			console.log(err)
			res.send(400);
		}
	})


	router.get('/employees', expJwt({ secret: config.JWT.Secret}), async (req, res) =>{
		if(req.user && (req.user.Account_Level === 'Employee' && req.user.Employee_Role && req.user.Employee_Role === 'Manager')){
			res.send(await sql_queries.get_employees(connection));
		}else{
			res.sendStatus(401);
		}
	})

	
	router.delete('/employees/:id', expJwt({ secret: config.JWT.Secret}), async (req, res) =>{
		if(req.user && (req.user.Account_Level === 'Employee' && req.user.Employee_Role && req.user.Employee_Role === 'Manager')){
			try{
				const id = parseInt(req.params['id']);
				connection.beginTransaction();

				await sql_queries.delete_employee(connection, id)

				connection.commit();
				res.send(200);
			}catch(err){
				connection.rollback();
				res.sendStatus(400);
			}
			
		}else{
			res.sendStatus(401);
		}
	})

	router.get('/employees/search', expJwt({ secret: config.JWT.Secret}), async (req, res) =>{
		if(req.user && (req.user.Account_Level === 'Employee' && req.user.Employee_Role && req.user.Employee_Role === 'Manager')){
			try{
				const search_query = req.query['query'] || '';
				const page = parseInt(req.query['page']) || 1;
	
				res.send(await sql_queries.search_employees(connection, page, search_query));
			}catch(err){
				res.sendStatus(400);
			}

		}else{
			res.sendStatus(401);
		}
	})

	// TODO: Update user
	router.put('/', expJwt({ secret: config.JWT.Secret}), async (req, res) => {});

	// TODO: Delete user
	router.delete('/', expJwt({ secret: config.JWT.Secret}), async (req, res) => {});

	return router;
};
