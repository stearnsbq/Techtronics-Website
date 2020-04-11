module.exports = function(connection) {
	var express = require('express');
	var router = express.Router();
	var Validator = require('jsonschema').Validator;
	var sql_queries = require('../queries.js');

	router.get('/', async (req, res) => {
        const person_id = req.user.Person_ID
        if(person_id){
            const orders = await sql_queries.get_orders(connection, person_id)
            res.send(orders);
        }else{
            res.sendStatus(401);
        }
	});

	router.post('/', async (req, res) => {
		const body = req.body;
		try{
			connection.startTransaction();
			await sql_queries.create_new_order(
				connection,
				body['customer_id'],
				body['count'],
				body['address'],
				body['zipcode'],
				body['state'],
				body['country'],
				body['items']
			);
			connection.commit()
			res.sendStatus(200);
		}catch(error){
			connection.rollback();
			res.sendStatus(500);
		}

    });
    return router;
};
