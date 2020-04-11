module.exports = function(connection) {
	var express = require('express');
    var router = express.Router();
    var Validator = require('jsonschema').Validator;
    var sql_queries = require('../queries.js')
    var multer  = require('multer')
	var {v1} = require('uuid')
	const fs = require('fs')


    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
		  const path = './uploads/media/'+ req.body.media;

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


    router.post('/upload', upload.fields([{name: 'media', maxCount: 1}, {name: 'media_image', maxCount: 1}]), (req, res)=>{
		if(req.files){
			res.send(req.files['media_image'][0].filename);
		}else{
			res.sendStatus(400);
		}
    })


	router.get('/games', async (req, res) => {
		const games = await sql_queries.get_all_games(connection);
		res.send(games);
	});


	router.get('/software', async (req, res) => {
		const software = await sql_queries.get_all_software(connection);
		res.send(software);
	});


	router.get('/hardware', async (req, res) => {
		const hardware = await sql_queries.get_all_hardware(connection);
		res.send(hardware);
	});


	router.get('/video', async (req, res) => {
		const video = await sql_queries.get_all_videos(connection);
		res.send(video);
	});


	router.get('/specials', async (req, res) => {
		const results = await sql_queries.get_all_specials(connection);
		res.send(results);
	});


	router.get('/specials/:id', async (req, res) => {
		const special = await sql_queries.get_specials_by_id(connection);
		res.send(special);
	});


	router.get('/search', async (req, res) => {
		try {
			const search_query = req.query['query'];
			const page = parseInt(req.query['page']);

			if (search_query && page) {
				res.send(
					await sql_queries.search(
						connection,
						parseInt(req.query['page']),
						connection.escape(`%${search_query}%`)
					)
				);
			} else if (search_query) {
				res.send(await sql_queries.search(connection, 1, connection.escape(`%${search_query}%`)));
			} else if (page) {
				res.send(await sql_queries.search(connection, parseInt(page)));
			} else {
				res.send(await sql_queries.search(connection));
			}
		} catch (err) {
			console.log(error);
			res.sendStatus(500);
		}
    });
    

	router.get('/', async (req, res) => {
		const page = parseInt(req.query['page']);
		if (page) {
			res.send(await sql_queries.get_all_media(connection, page));
		} else {
			res.send(await sql_queries.get_all_media(connection));
		}
    });
    

	router.get('/:id', async (req, res) => {
		const id = req.params['id'];
		res.send(await sql_queries.get_media_by_id(connection, id));
	});

	// POST ENDPOINTS

    router.post('/specials', async (req, res) => {
        const body = req.body;
        await sql_queries.create_new_special(connection, body['percentage_off'], body['start_date'], body['end_date']);
        res.sendStatus(200);
    });



	router.post('/', async (req, res) => {
		if (req.user && req.user.Account_Level !== 'Employee') {
			res.sendStatus(401);
			return;
		}

		const body = req.body;

		var JsonValidator = new Validator();
		var result = JsonValidator.validate(body, schemas.register_schema);

		try {
			if (result.errors.length <= 0) {
				throw new Error(result.errors);
			}

			connection.beginTransaction();

			await sql_queries.add_new_media(
				connection,
				body['name'],
				body['platform'],
				body['price'],
				body['condition'],
				body['mediaType'],
				body['mediaFields']
			);

			var id = await sql_queries.get_last_id(connection);

			connection.commit();
			res.redirect(`./media/${id}`);
		} catch (err) {
			console.log(err);
			connection.rollback();
			res.sendStatus(401);
		}
	});

	return router;
};
