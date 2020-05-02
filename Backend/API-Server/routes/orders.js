module.exports = function(connection) {
	var express = require('express');
	var router = express.Router();
	var Validator = require('jsonschema').Validator;
	var sql_queries = require('../queries.js');
	const config = require('../config/config.js');
	var expJwt = require('express-jwt');

	router.get('/', expJwt({ secret: config.JWT.Secret}), async (req, res) => {
		if(req.user){
			const person_id = req.user.Person_ID
            const orders = await sql_queries.get_orders(connection, person_id)
            res.send(orders);
        }else{
            res.sendStatus(401);
        }
	});


	router.get('/:id', expJwt({ secret: config.JWT.Secret}), async (req, res) => {
		try{
			if(req.user){
				const person_id = req.user.Person_ID
				const order_id = parseInt(req.params['id'])
				res.send(await sql_queries.get_order_by_id(connection, person_id, order_id));
			}else{
				res.sendStatus(401);
			}
		}catch(err){
			console.log(err)
			res.send(err, 500);
		}

	});

	router.post('/', expJwt({ secret: config.JWT.Secret}), async (req, res) => {
		const body = req.body;
		try{
			connection.beginTransaction();
			await sql_queries.create_new_order(
				connection,
				req.user.Person_ID,
				body['count'],
				body['address'],
				body['zipcode'],
				body['state'],
				body['country'],
				body['items'],
				body['price']
			);
			connection.commit()
			const order_id = await sql_queries.get_last_id(connection);
			res.redirect(`./orders/${order_id}`);
		}catch(error){
			console.log(error)
			connection.rollback();
			res.sendStatus(500);
		}

    });
    return router;
};
