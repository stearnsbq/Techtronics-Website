module.exports = function(connection) {
	var express = require('express');
	var router = express.Router();
	var Validator = require('jsonschema').Validator;
	var sql_queries = require('../queries.js');

	router.get('/', async (req, res) => {
		var Person_ID = req.user.Person_ID;

		var user = await sql_queries.get_user_info(connection, Person_ID);

		res.send(user);
	});

	// TODO: Update user
	router.put('/', async (req, res) => {});

	// TODO: Delete user
	router.delete('/', async (req, res) => {});

	return router;
};
