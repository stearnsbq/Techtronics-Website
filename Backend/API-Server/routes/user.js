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

	// TODO: Update user
	router.put('/', expJwt({ secret: config.JWT.Secret}), async (req, res) => {});

	// TODO: Delete user
	router.delete('/', expJwt({ secret: config.JWT.Secret}), async (req, res) => {});

	return router;
};
