const { compare_password } = require('./util.js');
var bs = require('binary-search');
const argon2 = require('argon2');
var jwt = require('jsonwebtoken'); // will need for login only endpoints
const config = require('./config/config.js');
const ITEMS_PER_PAGE = 12;

class Queries {


	static get_order_by_id(connection, person_id, order_id){
		return new Promise((resolve, reject) =>{
			connection.query("SELECT * FROM `Order` WHERE Order_ID = ?", [order_id], async (err ,results, fields) =>{
				if(err){
                    return reject(err);
                }else{
				
					if(results.length > 0){

						if(results[0].Customer !== person_id){
							return reject(new Error("UnauthorizedError"))
						}
	

						results[0]['items'] = await this._get_order_items(connection, results[0]['Order_ID']);
					}

					return resolve(results);
                }
			})
		})
	}

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
	
	static get_publishers(connection){
		return new Promise((resolve, reject) =>{
			const query = "SELECT Company_ID, Name FROM Company JOIN Publisher ON (Company.Company_ID = Publisher.Publisher_ID)"
			connection.query(query, (err, results, fields) => {
				return err ? reject(err) : resolve(results);
			})


		})
	}

	static get_developers(connection){
		return new Promise((resolve, reject) =>{
			const query = "SELECT Company_ID, Name FROM Company JOIN Developer ON (Company.Company_ID = Developer.Developer_ID)"
			connection.query(query, (err, results, fields) => {
				return err ? reject(err) : resolve(results);
			})


		})
	}

	static get_manufacturers(connection){
		return new Promise((resolve, reject) =>{
			const query = "SELECT Company_ID, Name FROM Company JOIN Manufacturer ON (Company.Company_ID = Manufacturer.Manufacturer_ID)"
			connection.query(query, (err, results, fields) => {
				return err ? reject(err) : resolve(results);
			})


		})
	}


    static _get_order_items(connection, order_id){
        return new Promise((resolve, reject)=>{
			const query = `SELECT Media.Media_ID, Media.Type, Media.Quantity, Media.Name, Platform, User_rating, Order_Items.Price as 'Price', \`Condition\`, Game.Genre AS 'Game_Genre', ESRB_Rating, Hardware.Type AS 'Hardware_Type', Video.Genre AS 'Video_Genre', MPAA_Rating, Software.Type AS 'Software Type' FROM Order_Items JOIN Media ON Order_Items.Media = Media.Media_ID LEFT JOIN Video ON Video.Video_ID=Media.Media_ID LEFT JOIN Software ON Software.Software_ID=Media.Media_ID LEFT JOIN Game ON Game.Game_ID=Media.Media_ID LEFT JOIN Hardware ON Hardware.Hardware_ID=Media.Media_ID WHERE Order_Items.Order=?`
            connection.query(query, [order_id], async (err, results, fields) => {
                if(err){
                    return reject(err);
                }else{
					var send = [];

					
					for (const result of results) {
						var tmp = {};
						for (const prop in result) {
							if (result[prop]) {
								tmp[prop] = result[prop];
							}
						}
						send.push(tmp);
					}

                    return resolve(send);
                }
            })

        })

	}
	
	static add_new_special_to_media(connection, media_id, special_id){
		return new Promise((resolve, reject)=>{

			connection.query("INSERT INTO Media_Specials (Special_ID, Media) VALUES (?, ?)", [special_id, media_id], (err, results, fields) =>{
				return err ? reject(err) : resolve(results);
			})
			
		})
	}


	static _update_inventory_count(connection, media_id){
			return new Promise((resolve, reject) => {
				connection.query("UPDATE Media SET Quantity = Quantity - 1 WHERE Media_ID = ?", [media_id], (err, results, fields) =>{
					return err ? reject(err) : resolve(results);
				})
			})
	}



	static create_new_order(connection, customer_id, count, address, zipcode, state, country, items, price) {
		return new Promise((resolve, reject) => {
			connection.query(
				'INSERT INTO `Order` (Customer, Media_Count, Address, Zip_code, State, Country, Price, Ordered_date) VALUES (?, ?, ?, ?, ?, ?, ?, SYSDATE())',
				[ customer_id, count, address, zipcode, state, country, price],
				async (err, results, fields) => {
					if (err) {
						return reject(err);
					} else {
						try {
							const id = await this.get_last_id(connection);
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
				'INSERT INTO Order_Items (`Order`, Media, Price) VALUES (?, ?, ?)',
				[ order_id, item['Media_ID'], item['Price'] ],
				async (err, results, fields) => {
					if(err){
						return reject(err);
					}else{
						return resolve(await this._update_inventory_count(connection, item['Media_ID']))
					}
				}
			);
		});
	}

	static get_employees(connection){
		return new Promise((resolve, reject) => {
			connection.query("SELECT Person_ID, Username, Email, CONCAT(First_name, ', ', Last_name) AS Name, Hire_date, Role FROM Person JOIN Employee ON (Person.Person_ID = Employee.Employee_ID)", (err, results, fields ) => {
				return err ? reject(err) : resolve(results);
			})
		})
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


	static set_verified(connection, email){
		return new Promise((resolve, reject) =>{
			connection.query("UPDATE Person SET active = 'Y' WHERE Email = ?", [email], (err, results, fields) =>{
				return err ? reject(err) : resolve(results);
			})
		})
	}


	static verify_email(connection , email, token){
		return new Promise((resolve, reject)=>{
			connection.query("SELECT * FROM verify_email_tokens WHERE email=? AND token=?", [email, token], (err, results, field)=>{
				if(err){
					return reject(err);
				}else{
					if(results.length <= 0){
						return reject(new Error("Not Found"))
					}else{

						var currentTime = new Date().getTime();
						var expiry = new Date(results[0]['expiry']).getTime();


						if(currentTime > expiry){
							return reject(new Error("Expired"))
						}else{
							return resolve(results)
						}

					}

				}
			})
		})
	}


	static _add_new_verification(connection, email, token){
		return new Promise((resolve, reject) => {
			connection.query("INSERT INTO verify_email_tokens (email, token, expiry) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 DAY))", [email, token], (err, results, fields) =>{
				return err ? reject(err) : resolve(results);
			})
				
		})
	}

	static _get_employee_role(connection, employee_id){
		return new Promise((resolve, reject) => {
			connection.query("SELECT Role FROM Employee WHERE Employee_ID =?", [employee_id], (err, results, fields) =>{
				return err ? reject(err) : resolve(results[0]['Role']);
			})
		})
	}

	static login_person(connection, username, password) {
		return new Promise((resolve, reject) => {
			connection.query(
				`SELECT Password, Person_ID, Account_Level, Active FROM Person WHERE Username=?`,[username],
				async (err, results, fields) => {
					if (!err && results.length > 0) {
						try {
							// compare the password sent from the user and the hash in the database
							if (await argon2.verify(results[0].Password, password)) {
								let payload = { Person_ID: results[0].Person_ID, Account_Level: results[0].Account_Level, Verified: results[0].Active };

								if(results[0].Account_Level === 'Employee'){
									payload['Employee_Role'] = await this._get_employee_role(connection, results[0].Person_ID);
								}

								var token = jwt.sign(
									payload,
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

	static create_new_special(connection, percentage_off, end_date, media_id) {
		return new Promise((resolve, reject) => {
			connection.query(
				'INSERT INTO Specials (Percentage_off, Start_date, End_date) VALUES (?, SYSDATE(), ?)',
				[ percentage_off, end_date ],
				async (err, results, fi) => {
					if(err){
						return reject(err);
					}else{
						const special_id = await this.get_last_id(connection);
						return resolve(await this.add_new_special_to_media(connection, media_id, special_id))
					}
					
				}
			);
		});
	}

	static _add_media_specials(connection, media_id, special_id){
		return new Promise((resolve, reject) => {

			connection.query("SELECT * FROM Specials JOIN Media_Specials ", [special_id, media_id], (err, results, fields) =>{
				return err ? reject(err) : resolve(results);
			})

		})
	}

	static get_all_games(connection) {
		return new Promise((resolve, reject) => {
			const query = `SELECT * FROM Media JOIN Game ON Game.Game_ID=Media.Media_ID`;

			connection.query(query, async (err, results, fields) => {

				if(err){
					return resolve(err);
				}else{
					let send = [];
					for (const result of results) {
						
						for (const prop in result) {
							if (result[prop] === null) {
								delete result[prop];
							}
						}
						
						result['images'] = await this._get_images_for_media(connection, result.Media_ID);
						result['companyInfo'] = await this._add_companies(connection, result.Media_ID);
						result['DLC'] = await this._add_DLC(connection, result.Media_ID);
						send.push(result);
					}
					return resolve(send);

				}
				
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

	static create_customer(connection, id) {
		return new Promise((resolve, reject) => {
			connection.query(
				`INSERT INTO Customer (Customer_ID, Registration_Date) VALUES (?, SYSDATE())`,
				[ id ],
				(err, results, fields) => {
					return err ? reject(err) : resolve(results);
				}
			);
		});
	}

	// creates a new employee in the employee table based off the id

	static create_employee(connection, id, role) {
		return new Promise((resolve, reject) => {
			connection.query(
				`INSERT INTO Employee (Employee_ID, Hire_date, Role) VALUES (?, SYSDATE(), ?)`,
				[ id, role ],
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

	static _add_new_game(connection, id, fields) {
		return new Promise((resolve, reject) => {
			connection.query(
				`INSERT INTO Game (Game_ID, Genre, ESRB_rating) VALUES (${id}, ${connection.escape(
					fields['genre']
				)}, ${connection.escape(fields['esrb_rating'])})`,
				async (err, results, fi) => {
					return err ? reject(err) : resolve(results);
				}
			);
		});
	}

	static _add_new_hardware(connection, id, fields) {
		return new Promise((resolve, reject) => {
			connection.query(
				`INSERT INTO Hardware (Hardware_ID, Type) VALUES (${id}, ${connection.escape(fields['type'])})`,
				async (err, results, fi) => {
					return err ? reject(err) : resolve(results);
				}
			);
		});
	}

	static _add_new_video(connection, id, fields) {
		return new Promise((resolve, reject) => {
			connection.query(
				`INSERT INTO Video (Video_ID, Genre, MPAA_rating) VALUES (${id}, ${connection.escape(
					fields['genre']
				)}, ${connection.escape(fields['mpaa_rating'])})`,
				async (err, results, fi) => {
					return err ? reject(err) : resolve(results);
				}
			);
		});
	}

	static _add_new_software(connection, id, fields) {
		return new Promise((resolve, reject) => {
			connection.query(
				`INSERT INTO Software (Software_ID, Type) VALUES (${id}, ${connection.escape(fields['type'])})`,
				(err, results, fi) => {
					return err ? reject(err) : resolve(results);
				}
			);
		});
	}

	static _add_new_media_company(connection, media_id, company_id, company_type) {
		return new Promise((resolve, reject) => {
			console.log(media_id, company_id, company_type)
			connection.query(`INSERT INTO Media_Companies VALUES (?, ?, ?)`, [media_id, company_id, company_type] ,(err, results, fi) => {
				if(!err){
					connection.query("UPDATE Company SET Number_of_products = Number_of_products + 1 WHERE Company_ID = ?", [company_id], (err, results, fi) => {
						return err ? reject(err) : resolve(results);
					})
				}
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

	static add_new_media(connection, body) {
		return new Promise((resolve, reject) => {
			console.log(body)
			const companyInfo = body['companyInfo']

			connection.query(
				`INSERT INTO Media (Name, Platform, Price, \`Condition\`, Quantity, Type) VALUES (?, ?, ?, ?, ?, ?)`, [body['name'], body['platform'], body['price'], body['condition'], body['quantity'], body['type']],
				async (err, results, fi) => {
					if (err) {
						return reject(err);
					} else {
						try {
							const id = await this.get_last_id(connection);

							for(const company in companyInfo){
		
								await this._add_new_media_company(connection, id, companyInfo[company], company)
							}

							switch (body['mediaType'].toLowerCase()) {
								case 'game':
									await this._add_new_game(connection, id, body['mediaFields']);
									break;
								case 'dlc':
									await this._add_new_hardware(connection, id, body['mediaFields']);
									break;
								case 'video':
									await this._add_new_video(connection, id, body['mediaFields']);
									break;
								case 'software':
									await this._add_new_software(connection, id, body['mediaFields']);
									break;
								case 'hardware':
									await this._add_new_hardware(connection, id, body['mediaFields']);
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
					`INSERT INTO Phone_numbers (Person_ID, Phone_number) VALUES (?,?)`, [id, element], 
					(err, results, fields) => {
						return err ? reject(err) : resolve(results);
					}
				);
			});
		});
	}

	static get_media_by_id(connection, id) {
		return new Promise((resolve, reject) => {
			const query = `SELECT DISTINCT Media.Media_ID, Media.Type, Media.Quantity, Media.Name, Platform, User_rating, Price, \`Condition\`, Game.Genre AS 'Game_Genre', ESRB_Rating, Hardware.Type AS 'Hardware_Type', Video.Genre AS 'Video_Genre', MPAA_Rating, Software.Type AS 'Software Type'
			FROM Media LEFT JOIN Video ON Video.Video_ID=Media.Media_ID 
			LEFT JOIN Software ON Software.Software_ID=Media.Media_ID 
			LEFT JOIN Game ON Game.Game_ID=Media.Media_ID 
			LEFT JOIN Hardware ON Hardware.Hardware_ID=Media.Media_ID 
			LEFT JOIN Media_Companies ON (Media_Companies.Media = Media.Media_ID)
			LEFT JOIN Company ON (Media_Companies.Company = Company.Company_ID) WHERE Media.Media_ID=? AND Media.deleted IS NULL `

			


			connection.query(query, [ id ], async (err, results, fields) => {
				if(err){
					return reject(err);
				}else{
						if(results.length <= 0){
							return resolve({});
						}

						var tmp = {};
						for (const prop in results[0]) {
							if (results[0][prop] !== null) {
								tmp[prop] = results[0][prop];
							}
						}

						const images = await this._get_images_for_media(connection, results[0].Media_ID);	
						tmp['images'] = images ? images : [];
						tmp['Specials'] = await this._add_specials(connection, results[0].Media_ID);
						tmp['DLC'] = await this._add_DLC(connection, results[0].Media_ID);
						tmp['companyInfo'] = await this._add_companies(connection, results[0].Media_ID);
					
					return resolve(tmp);
				}

			});
		});
	}

	static _add_DLC(connection, id) {
		return new Promise((resolve, reject) => {
			connection.query(
				`SELECT DLC_ID FROM Game JOIN DLC ON DLC.Game_ID=Game.Game_ID WHERE Game.Game_ID = ?`,[id],
				(err, DLCs, fi) => {
					return err ? reject(err) : resolve(DLCs)
				}
			);
		});
	}

	static get_page_count(connection, serverQuery='\'%%\'') {
		return new Promise((resolve, reject) => {
			const query = `SELECT COUNT(DISTINCT(Media_ID)) as total
								FROM Media LEFT JOIN Video ON Video.Video_ID=Media.Media_ID 
								LEFT JOIN Software ON Software.Software_ID=Media.Media_ID 
								LEFT JOIN Game ON Game.Game_ID=Media.Media_ID 
								LEFT JOIN Hardware ON Hardware.Hardware_ID=Media.Media_ID 
								WHERE (Name LIKE ${serverQuery} 
								OR Platform LIKE ${serverQuery}
								OR \`Condition\` LIKE ${serverQuery}
								OR Game.Genre LIKE ${serverQuery} 
								OR Video.Genre LIKE ${serverQuery}
								OR Software.Type LIKE ${serverQuery}
								OR Hardware.Type LIKE ${serverQuery}) AND Media.deleted IS NULL`;

					

			connection.query(query, (err, results, fields) => {
				return err ? reject(err) : resolve(results[0]);
			});
		});
	}



	static get_all_media(connection, page = 1) {
		return new Promise((resolve, reject) => {
			let offset = (page - 1) * ITEMS_PER_PAGE;
			const query = `SELECT DISTINCT Media.Media_ID, Media.Type, Media.Quantity, Media.Name, Platform, User_rating, Price, \`Condition\`, Game.Genre AS 'Game_Genre', ESRB_Rating, Hardware.Type AS 'Hardware_Type', Video.Genre AS 'Video_Genre', MPAA_Rating, Software.Type AS 'Software Type'
									FROM Media LEFT JOIN Video ON Video.Video_ID=Media.Media_ID 
									LEFT JOIN Software ON Software.Software_ID=Media.Media_ID 
									LEFT JOIN Game ON Game.Game_ID=Media.Media_ID 
									LEFT JOIN Hardware ON Hardware.Hardware_ID=Media.Media_ID 
									LEFT JOIN Media_Companies ON (Media_Companies.Media = Media.Media_ID)
									LEFT JOIN Company ON (Media_Companies.Company = Company.Company_ID)
									WHERE Media.deleted IS NULL
									LIMIT ${offset} , ${ITEMS_PER_PAGE}`;


			connection.query(query, async (err, results, fields) => {
				var send = [];
				if (!err) {
					// Due to the query having columns with null values, this trims the nulls from the media (I don't think you can do much better than O(n*12) )

					for (const result of results) {
						var tmp = {};
					
						for (const prop in result) {
							if (result[prop] !== null) {
								tmp[prop] = result[prop];
							}
						}

						tmp['companyInfo'] = await this._add_companies(connection, result.Media_ID);	
						tmp['images'] = await this._get_images_for_media(connection, result.Media_ID);;
						tmp['DLC'] = await this._add_DLC(connection, result.Media_ID);
						tmp['Specials'] = await this._add_specials(connection, result.Media_ID);
						send.push(tmp);
					}
					// we got the data resolve the promise

					return resolve(send);
				} else {
					// some error reject the promise
					return reject(err);
				}
			});
		});
	}

	static _get_images_for_media(connection, id){
		return new Promise((resolve, reject) =>{
			const query = `SELECT fileName FROM Media JOIN Media_Images ON Media_Images.Media_ID = Media.Media_ID WHERE Media.Media_ID=?`;

			connection.query(query, [id], (err, allMedia, fi) => {
				return err ? reject(err) : resolve(allMedia.map(item => {
					return item['fileName']
				}));
			})
		})
	}

	static set_images(connection, media_id, filename){
		return new Promise((resolve, reject) => {
			connection.query('INSERT INTO Media_Images (Media_ID, FileName) VALUES (?, ?)', [media_id, filename], (err, results, fi)=>{
				return err ? reject(err) : resolve(results)
			})
		})
	}


	static _add_companies(connection, media_id){
		return new Promise((resolve, reject) => {

			connection.query('SELECT MAX(CASE WHEN Type = "Publisher" THEN Company.Name END) "Publisher", MAX(CASE WHEN Type = "Developer" THEN Company.Name END) "Developer", MAX(CASE WHEN Type = "Manufacturer" THEN Company.Name END) "Manufacturer" FROM Media_Companies JOIN Company ON Media_Companies.Company = Company.Company_ID WHERE Media_Companies.Media = ?', [media_id], (err, results, fi) => {
				if(err){
					return reject(err);
				}else{
					for(const prop in results[0]){
						if(results[0][prop] === null){
							delete results[0][prop];
						}
					}
					
					return resolve(results[0]);
				}
			});

		})

	}


	static _add_specials(connection, media_id){
		return new Promise((resolve, reject) =>{
			connection.query("SELECT End_date, Special_ID, Start_date, Percentage_off FROM Specials JOIN Media_Specials ON (Specials.Specials_ID = Media_Specials.Special_ID) WHERE Media_Specials.Media = ?", [media_id], (err, results, fields) =>{
				return err ? reject(err) : resolve(results);
			});
		})
	}


	static delete_media(connection, media_id){
		return new Promise((resolve, reject)=>{
			connection.query("UPDATE Media SET deleted = SYSDATE() WHERE Media_ID=?", [media_id], (err, results, fields) =>{
				return err ? reject(err) : resolve(results);
			})
		})
	}

	static _update_DLC(connection, DLC_ID, Game_ID){
		return new Promise((resolve, reject) =>{
			connection.query("UPDATE DLC SET DLC_ID = ?, Game_ID = ?", [DLC_ID, Game_ID], (err, results, fields) =>{
				return err ? reject(err) : resolve(results);
			})
		})

	}


	static _update_game(connection, media){
		return new Promise((resolve, reject) =>{
			connection.query("UPDATE Game SET ESRB_Rating = ?, Genre= ? WHERE Game_ID = ?", [media['ESRB_Rating'], media['Game_Genre'], media['Media_ID']], (err, results, fields) => {
				return err ? reject(err) : resolve(results);
			})
		})
	}

	static _update_video(connection, media){
		return new Promise((resolve, reject) =>{
			connection.query("UPDATE Video SET MPAA_Rating = ?, Genre= ? WHERE Video_ID = ?", [media['MPAA_Rating'], media['Video_Genre'], media['Media_ID']], (err, results, fields) => {
				return err ? reject(err) : resolve(results);
			})
		})
	}

	static _update_software(connection, media){
		return new Promise((resolve, reject) =>{
			connection.query("UPDATE Software SET Type=? WHERE Software_ID = ?", [media['Software_Type'], media['Media_ID']], (err, results, fields) => {
				return err ? reject(err) : resolve(results);
			})
		})
	}

	static _update_hardware(connection, media){
		return new Promise((resolve, reject) =>{
			connection.query("UPDATE Hardware SET Hardware_Type=? WHERE Hardware_ID = ?", [media['Hardware_Type'], media['Media_ID']], (err, results, fields) => {
				return err ? reject(err) : resolve(results);
			})
		})
	}

	static update_media(connection, media){
		return new Promise((resolve, reject)=>{
			connection.query("UPDATE Media SET `Condition`=?, Name=?, Price=?, Platform=?, Quantity=?, Type=?  WHERE Media_ID=?", [media['Condition'], media['Name'], media['Price'], media['Platform'], media['Quantity'], media['Type'], media.Media_ID], async (err, results, fields) =>{
				if(err){
					return reject(err);
				}else{
					if(media['DLC'].length > 0){
						for(const dlc of media['DLC']){
							await this._update_DLC(connection, dlc.Media_ID, media.Media_ID)	
						}
					}

					switch(media['Type']){
						case 'Game':
							return resolve(await this._update_game(connection, media));
						case 'Video':
							return resolve(await this._update_video(connection, media));
						case 'Hardware':
							return resolve(await this._update_hardware(connection, media));
						case 'Software':
							return resolve(await this._update_software(connection, media));
						default:
							return reject(new Error("Invalid Media Type"))
					}

				}
			})
		})
	}

	static search(connection, page = 1, searchQuery = "'%%'", sort="'DESC'", itemsPerPage= ITEMS_PER_PAGE) {
		return new Promise((resolve, reject) => {
			let sorted = 'ORDER BY Price ';

			if(sort == 'DESC'){
				sorted = sorted + ' DESC'
			}else if (sort == 'ASC'){
				sorted = sorted + ' ASC'
			}

			const offset = (page - 1) * ITEMS_PER_PAGE;
			const query = `SELECT DISTINCT Media.Media_ID, Media.Type, Media.Quantity, Media.Name, Platform, User_rating, Price, \`Condition\`, Game.Genre AS 'Game_Genre', ESRB_Rating, Hardware.Type AS 'Hardware_Type', Video.Genre AS 'Video_Genre', MPAA_Rating, Software.Type AS 'Software Type'
								FROM Media LEFT JOIN Video ON Video.Video_ID=Media.Media_ID 
								LEFT JOIN Software ON Software.Software_ID=Media.Media_ID 
								LEFT JOIN Game ON Game.Game_ID=Media.Media_ID 
								LEFT JOIN Hardware ON Hardware.Hardware_ID=Media.Media_ID 
								LEFT JOIN Media_Companies ON (Media_Companies.Media = Media.Media_ID)
								LEFT JOIN Company ON (Media_Companies.Company = Company.Company_ID)
								WHERE (Media.Name LIKE ${searchQuery} 
								OR Media.Media_ID LIKE ${searchQuery}
								OR Platform LIKE ${searchQuery}
								OR \`Condition\` LIKE ${searchQuery}
								OR Game.Genre LIKE ${searchQuery} 
								OR Video.Genre LIKE ${searchQuery}
								OR Software.Type LIKE ${searchQuery}
								OR Hardware.Type LIKE ${searchQuery} 
								OR Company.Name LIKE ${searchQuery}) AND Media.deleted IS NULL ${sorted} LIMIT ${offset} , ${itemsPerPage}`;

							

			// Get all of the media in the database
			connection.query(query, async (err, allMedia, fi) => {
				var send = [];
				if (!err) {
					
					for (const result of allMedia) {
						
						for (const prop in result) {
							if (result[prop] === null) {
								delete result[prop];
							}
						}
						
						result['images'] = await this._get_images_for_media(connection, result.Media_ID);
						result['companyInfo'] = await this._add_companies(connection, result.Media_ID);
						result['DLC'] = await this._add_DLC(connection, result.Media_ID);
						result['Specials'] = await this._add_specials(connection, result.Media_ID);
						send.push(result);
					}

					// we got the data resolve the promise

					return resolve(send);
				} else {
					// some error reject the promise
					return reject(err);
				}
			});
		});
	}
}

module.exports = Queries;
