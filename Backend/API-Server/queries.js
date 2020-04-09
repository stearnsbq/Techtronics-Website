const { compare_password } = require('./util.js');
var bs = require('binary-search');
const argon2 = require('argon2');
var jwt = require('jsonwebtoken'); // will need for login only endpoints
const config = require('./config/config.js');
const ITEMS_PER_PAGE = 10;

class Queries {

    static get_orders(connection, person_id){
        return new Promise((resolve, reject) =>{
            connection.query('SELECT * FROM `Order` WHERE Customer=?', [person_id], async (err, results, fields) => {
                if(err){
                    return reject(err);
                }else{
                    for(var result of results){
                        result['items'] = await this._get_order_items(connection, result['Order_ID']);
                    }

                    return resolve(results);
                }
            })
        })
    }


    static _get_order_items(connection, order_id){
        return new Promise((resolve, reject)=>{
            connection.query(`SELECT Media FROM Order_Items WHERE \`Order\`=?`, [order_id], async (err, results, fields) => {
                if(err){
                    return reject(err);
                }else{
                    var send = []
                    for(const result of results){
                        send.push(await this.get_media_by_id(connection, result['Media']));
                    }
                    return resolve(send);
                }
            })

        })

    }



	static create_new_order(connection, customer_id, count, address, zipcode, state, country, items) {
		return new Promise((resolve, reject) => {
			connection.query(
				'INSERT INTO Orders (Customer, Media_Count, Address, Zip_code, State, Country) VALUES (?, ?, ?, ?, ?, ?)',
				[ customer_id, count, address, zipcode, state, country ],
				async (err, results, fields) => {
					if (err) {
						return reject(err);
					} else {
						try {
							const id = get_last_id(connection);
							for (const item of items) {
								await this._add_order_item(connection, id, item);
							}
							return resolve(results);
						} catch (error) {
							return reject(error);
						}
					}
				}
			);
		});
	}

	static _add_order_item(connection, order_id, item) {
		return new Promise((resolve, reject) => {
			connection.query(
				'INSERT INTO Order_Items (Order, Media) VALUES (?, ?)',
				[ order_id, item ],
				(err, results, fields) => {
					return err ? reject(err) : resolve(results);
				}
			);
		});
	}

	static get_user_info(connection, id) {
		return new Promise((resolve, reject) => {
			connection.query(
				'SELECT * FROM Person LEFT JOIN Customer ON Person.Person_ID = Customer.Customer_ID LEFT JOIN Employee ON Person.Person_ID = Employee.Employee_ID WHERE Person_ID=?',
				[ id ],
				(err, results, fields) => {
					var send = [];
					if (!err) {
						// Due to the query having columns with null values, this trims the nulls from the media (I don't think you can do much better than O(n*12) )

						for (const result of results) {
							var tmp = {};
							for (const prop in result) {
								if (result[prop]) {
									tmp[prop] = result[prop];
								}
							}
							send.push(tmp);
						}
						// we got the data resolve the promise

						return resolve(send);
					} else {
						// some error reject the promise
						return reject(err);
					}
				}
			);
		});
	}

	static login_person(connection, username, password) {
		return new Promise((resolve, reject) => {
			connection.query(
				`SELECT Password, Person_ID, Account_Level FROM Person WHERE Username=${connection.escape(
					username
				)}`,
				async (err, results, fields) => {
					if (!err && results.length > 0) {
						try {
							// compare the password sent from the user and the hash in the database
							if (await argon2.verify(results[0].Password, password)) {
								var token = jwt.sign(
									{ Person_ID: results[0].Person_ID, Account_Level: results[0].Account_Level },
									config.JWT.Secret,
									{ expiresIn: '7d' }
								); // send a JWT token for authentication
								return resolve({ token: token });
							} else {
								return reject(new Error('UnauthorizedError'));
							}
						} catch (error) {
							return reject(error);
						}
					} else {
						// invalid username
						return reject(err);
					}
				}
			);
		});
	}

	static get_all_hardware(connection) {
		return new Promise((resolve, reject) => {
			const query = `SELECT Media_ID, Name, Platform, User_rating, Price, \`Condition\`, Hardware.Type AS 'Hardware Type' FROM Media JOIN Hardware ON Hardware.Hardware_ID=Media.Media_ID`;

			connection.query(query, (err, results, fields) => {
				return err ? reject(err) : resolve(results);
			});
		});
	}

	static get_all_software(connection) {
		return new Promise((resolve, reject) => {
			const query = `SELECT Media_ID,Name,Platform,User_rating,Price,\`Condition\`,Software.Type AS 'Software Type'FROM Media JOIN Software ON Software.Software_ID = Media.Media_ID`;

			connection.query(query, (err, results, fields) => {
				return err ? reject(err) : resolve(results);
			});
		});
	}

	static get_specials_by_id(connection, id) {
		return new Promise((resolve, reject) => {
			connection.query('SELECT * FROM Specials WHERE Specials_ID=?', [ id ], (err, results, fi) => {
				return err ? reject(err) : resolve(results);
			});
		});
	}

	static create_new_special(connection, percentage_off, start_date, end_date) {
		return new Promise((resolve, reject) => {
			connection.query(
				'INSERT INTO Specials (Percentage_off, Start_date, End_date) VALUES (?, ?, ?)',
				[ percentage_off, start_date, end_date ],
				(err, results, fi) => {
					return err ? reject(err) : resolve(results);
				}
			);
		});
	}

	static get_all_games(connection) {
		return new Promise((resolve, reject) => {
			const query = `SELECT Media_ID, Name, Platform, User_rating, Price, \`Condition\`, Game.Genre AS 'Game Genre', ESRB_Rating FROM Media JOIN Game ON Game.Game_ID=Media.Media_ID`;

			connection.query(query, (err, results, fields) => {
				return err ? reject(err) : resolve(results);
			});
		});
	}

	static get_all_videos(connection) {
		return new Promise((resolve, reject) => {
			const query = `SELECT Media_ID, Name, Platform, User_rating, Price, \`Condition\`, Video.Genre AS 'Video Genre', MPAA_Rating FROM Media JOIN Video ON Video.Video_ID=Media.Media_ID`;

			connection.query(query, (err, results, fields) => {
				return err ? reject(err) : resolve(results);
			});
		});
	}

	static register_account(connection, username, hash, email, fName, lName, bDate, account_level) {
		return new Promise((resolve, reject) => {
			connection.query(
				`INSERT INTO Person (Username, Password, Email, First_name, Last_name, Birth_date, Account_Level) VALUES (${connection.escape(
					username
				)}, '${hash}', ${connection.escape(email)}, ${connection.escape(
					fName
				)}, ${connection.escape(lName)}, ${connection.escape(bDate)}, ${connection.escape(
					account_level
				)})`,
				(err, results, fields) => {
					return err ? reject(err) : resolve(results);
				}
			);
		});
	}

	static create_customer(connection, id, register_date) {
		return new Promise((resolve, reject) => {
			connection.query(
				`INSERT INTO Customer (Customer_ID, Registration_Date) VALUES (?, ?)`,
				[ id, register_date ],
				(err, results, fields) => {
					return err ? reject(err) : resolve(results);
				}
			);
		});
	}

	// creates a new employee in the employee table based off the id

	static create_employee(connection, id, hire_date) {
		return new Promise((resolve, reject) => {
			connection.query(
				`INSERT INTO Employee (Employee_ID, Hire_date) VALUES (?, ?)`,
				[ id, hire_date ],
				(err, results, fields) => {
					return err ? reject(err) : resolve(results);
				}
			);
		});
	}

	static get_last_id(connection) {
		return new Promise((resolve, reject) => {
			connection.query("SELECT LAST_INSERT_ID() AS 'ID'", (err, results, fields) => {
				return err ? reject(err) : resolve(results[0]['ID']);
			});
		});
	}

	_add_new_game(connection, id, fields) {
		return new Promise((resolve, reject) => {
			connection.query(
				`INSERT INTO Game (Game_ID, Genre, ESRB_rating) VALUES (${id}, ${this.connection.escape(
					fields['genre']
				)}, ${this.connection.escape(fields['esrb_rating'])})`,
				async (err, results, fi) => {
					return err ? reject(err) : resolve(results);
				}
			);
		});
	}

	_add_new_hardware(connection, id, fields) {
		return new Promise((resolve, reject) => {
			connection.query(
				`INSERT INTO Hardware (Hardware_ID, Type) VALUES (${id}, ${this.connection.escape(fields['type'])})`,
				async (err, results, fi) => {
					return err ? reject(err) : resolve(results);
				}
			);
		});
	}

	_add_new_video(connection, id, fields) {
		return new Promise((resolve, reject) => {
			connection.query(
				`INSERT INTO Video (Video_ID, Genre, MPAA_rating) VALUES (${id}, ${this.connection.escape(
					fields['genre']
				)}, ${this.connection.escape(fields['mpaa_rating'])})`,
				async (err, results, fi) => {
					return err ? reject(err) : resolve(results);
				}
			);
		});
	}

	_add_new_software(connection, id, fields) {
		return new Promise((resolve, reject) => {
			connection.query(
				`INSERT INTO Software (Software_ID, Type) VALUES (${id}, ${this.connection.escape(fields['type'])})`,
				(err, results, fi) => {
					return err ? reject(err) : resolve(results);
				}
			);
		});
	}

	_add_new_media_company(connection, media_id, company_id) {
		return new Promise((resolve, reject) => {
			const query = `INSERT INTO Media_Companies VALUES (${media_id}, ${company_id})`;

			connection.query(query, (err, results, fi) => {
				return err ? reject(err) : resolve(results);
			});
		});
	}

	static get_all_specials(connection) {
		return new Promise((resolve, reject) => {
			connection.query('SELECT * FROM Specials', (err, results, fi) => {
				if (err) {
					return reject(err);
				} else {
					return resolve(results);
				}
			});
		});
	}

	static add_new_media(connection, name, platform, price, condition, mediaType, mediaFields, companies) {
		return new Promise((resolve, reject) => {
			connection.query(
				`INSERT INTO Media (Name, Platform, Price, \`Condition\`) VALUES (${this.connection.escape(
					name
				)}, ${this.connection.escape(platform)}, ${this.connection.escape(price)}, ${this.connection.escape(
					condition
				)})`,
				async (err, results, fi) => {
					if (err) {
						return reject(err);
					} else {
						try {
							const id = await this.get_last_id();

							switch (mediaType) {
								case 'game':
									await this._add_new_game(id, mediaFields);
									break;
								case 'dlc':
									await this._add_new_hardware(id, mediaFields);
									break;
								case 'video':
									await this._add_new_video(id, mediaFields);
									break;
								case 'software':
									await this._add_new_software(id, mediaFields);
									break;
								case 'hardware':
									await this._add_new_hardware(id, mediaFields);
									break;
								default:
									throw new Error('Invalid media type');
							}

							return resolve(results);
						} catch (error) {
							return reject(error);
						}
					}
				}
			);
		});
	}

	static add_phone_numbers(connection, id, arr) {
		return new Promise((resolve, reject) => {
			arr.forEach((element) => {
				connection.query(
					`INSERT INTO Phone_numbers (Person_ID, Phone_number) VALUES (${id}, ${connection.escape(
						element
					)})`,
					(err, results, fields) => {
						return err ? reject(err) : resolve(results);
					}
				);
			});
		});
	}

	static get_media_by_id(connection, id) {
		return new Promise((resolve, reject) => {
			connection.query('SELECT * FROM Media WHERE Media.Media_ID=?', [ id ], (err, results, fields) => {
				return err ? reject(err) : resolve(results[0]);
			});
		});
	}

	static _add_DLC(connection, media) {
		return new Promise((resolve, reject) => {
			connection.query(
				`SELECT DLC_ID, DLC.Game_ID
                                  FROM Game JOIN DLC ON DLC.Game_ID=Game.Game_ID 
                                  INNER JOIN Media ON DLC.DLC_ID = Media.Media_ID`,
				(err, DLCs, fi) => {
					if (!err) {
						// create a new DLC array for a game if the game has DLC (should be O(n log(n)) can be O(n) if array index match IDs)
						for (var DLC of DLCs) {
							// does a binary search to search all of the trimmed media and finds the game the DLC is for
							var index = bs(media, DLC['Game_ID'], (element, needle) => {
								return element['Media_ID'] - needle;
							});

							if (index >= 0) {
								if (!media[index]['DLC']) {
									media[index]['DLC'] = [];
								}

								media[index]['DLC'].push({ DLC_ID: DLC['DLC_ID'] });
							}
						}
						return resolve(media);
					} else {
						return reject(err);
					}
				}
			);
		});
	}

	static get_page_count(connection, page) {
		return new Promise((resolve, reject) => {
			const query = `SELECT COUNT(Media_ID) as total FROM Media`;
			connection.query(query, (err, results, fields) => {
				return err ? reject(err) : resolve(results[0]['total']);
			});
		});
	}

	static get_all_media(connection, page = 1) {
		return new Promise((resolve, reject) => {
			let offset = (page - 1) * ITEMS_PER_PAGE;
			const query = `SELECT Media_ID, Name, Platform, User_rating, Price, \`Condition\`, Game.Genre AS 'Game Genre', ESRB_Rating, Hardware.Type AS 'Hardware Type', Video.Genre AS 'Video Genre', MPAA_Rating, Software.Type AS 'Software Type'
            FROM Media LEFT JOIN Video ON Video.Video_ID=Media.Media_ID 
            LEFT JOIN Software ON Software.Software_ID=Media.Media_ID 
            LEFT JOIN Game ON Game.Game_ID=Media.Media_ID 
            LEFT JOIN Hardware ON Hardware.Hardware_ID=Media.Media_ID 
            LEFT JOIN Media_Companies ON Media_Companies.Media=Media.Media_ID LIMIT ${offset} , ${ITEMS_PER_PAGE}`;

			connection.query(query, async (err, results, fields) => {
				var send = [];
				if (!err) {
					// Due to the query having columns with null values, this trims the nulls from the media (I don't think you can do much better than O(n*12) )

					for (const result of results) {
						var tmp = {};
						for (const prop in result) {
							if (result[prop]) {
								tmp[prop] = result[prop];
							}
						}
						send.push(tmp);
					}
					// we got the data resolve the promise

					return resolve(await this._add_DLC(connection, send).catch());
				} else {
					// some error reject the promise
					return reject(err);
				}
			});
		});
	}

	static search(connection, page = 1, searchQuery = "'%%'") {
		return new Promise((resolve, reject) => {
			let offset = (page - 1) * ITEMS_PER_PAGE;
			const query = `SELECT Media_ID, Name, Platform, User_rating, Price, \`Condition\`, Game.Genre AS 'Game Genre', ESRB_Rating, Hardware.Type AS 'Hardware Type', Video.Genre AS 'Video Genre', MPAA_Rating, Software.Type AS 'Software Type'
                               FROM Media LEFT JOIN Video ON Video.Video_ID=Media.Media_ID 
                               LEFT JOIN Software ON Software.Software_ID=Media.Media_ID 
                               LEFT JOIN Game ON Game.Game_ID=Media.Media_ID 
                               LEFT JOIN Hardware ON Hardware.Hardware_ID=Media.Media_ID 
                               LEFT JOIN Media_Companies ON Media_Companies.Media=Media.Media_ID 
                               WHERE Name LIKE ${searchQuery} 
                               OR Platform LIKE ${searchQuery}
                               OR \`Condition\` LIKE ${searchQuery}
                               OR Game.Genre LIKE ${searchQuery} 
                               OR Video.Genre LIKE ${searchQuery}
                               OR Software.Type LIKE ${searchQuery}
                               OR Hardware.Type LIKE ${searchQuery} ORDER BY Media_ID LIMIT ${offset} , ${ITEMS_PER_PAGE}`;

			// Get all of the media in the database
			connection.query(query, async (err, allMedia, fi) => {
				var send = [];
				if (!err) {
					// Due to the query having columns with null values, this trims the nulls from the media (I don't think you can do much better than O(n*12) )
					for (const result of allMedia) {
						var tmp = {};
						for (const prop in result) {
							if (result[prop]) {
								tmp[prop] = result[prop];
							}
						}
						send.push(tmp);
					}
					// we got the data resolve the promise

					return resolve(await this._add_DLC(connection, send).catch());
				} else {
					// some error reject the promise
					return reject(err);
				}
			});
		});
	}
}

module.exports = Queries;
