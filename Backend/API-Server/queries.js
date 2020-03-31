const {compare_password} = require("./util.js")
var bs = require('binary-search');

class Queries {
    constructor(connection){
        this.connection = connection;
    }

    register_account(username, hash, email, fName, lName, bDate, account_level){
        return new Promise((resolve, reject) => {
            this.connection.query(
                `INSERT INTO Person (Username, Password, Email, First_name, Last_name, Birth_date, Account_Level) VALUES (${this.connection.escape(username)}, '${hash}', ${this.connection.escape(email)}, ${this.connection.escape(fName)}, ${this.connection.escape(lName)}, ${this.connection.escape(bDate)}, ${this.connection.escape(account_level)})`,
                (err, results, fields) => {
                    return err ? reject(err) : resolve(results); 
                }
            );
        })
    }
    
    
    create_customer(id, register_date){
        return new Promise((resolve, reject) => {
            this.connection.query(
                `INSERT INTO Customer (Customer_ID, Registration_Date) VALUES (?, ?)`,
                [id, register_date],
                (err, results, fields) => {
                    return err ? reject(err) : resolve(results); 
                }
            );
        })
    }
    
   
    // creates a new employee in the employee table based off the id
    
    create_employee(id, hire_date){
        return new Promise((resolve, reject) => {
            this.connection.query(
                `INSERT INTO Employee (Employee_ID, Hire_date) VALUES (?, ?)`,
                [ id, hire_date ],
                (err, results, fields) => {
                    return err ? reject(err) : resolve(results); 
                }
            );
            
        })
    }
    
    
    get_last_id(){
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT LAST_INSERT_ID() AS 'ID'", (err, results, fields) => {
                    return err ? reject(err) : resolve(results[0]['ID']);  
            })
        })
    
    }


    _add_new_game(id, fields){
        return new Promise((resolve, reject) => {
            this.connection.query(`INSERT INTO Game (Game_ID, Genre, ESRB_rating) VALUES (${id}, ${this.connection.escape(fields['genre'])}, ${this.connection.escape(fields['esrb_rating'])})`, async (err, results, fi) =>{
                return err ? reject(err) : resolve(results); 
            })
        })
    }

    _add_new_hardware(id, fields){
        return new Promise((resolve, reject) => {
            this.connection.query(`INSERT INTO Hardware (Hardware_ID, Type) VALUES (${id}, ${this.connection.escape(fields['type'])})`, async (err, results, fi) =>{
                return err ? reject(err) : resolve(results); 
            })
        })
    }

    _add_new_video(id, fields){
        return new Promise((resolve, reject) => {
            this.connection.query(`INSERT INTO Video (Video_ID, Genre, MPAA_rating) VALUES (${id}, ${this.connection.escape(fields['genre'])}, ${this.connection.escape(fields['mpaa_rating'])})`, async (err, results, fi) =>{
                return err ? reject(err) : resolve(results); 
            })
        })
    }

    _add_new_software(id, fields){
        return new Promise((resolve, reject) => {
            this.connection.query(`INSERT INTO Software (Software_ID, Type) VALUES (${id}, ${this.connection.escape(fields['type'])})`, async (err, results, fi) =>{
                return err ? reject(err) : resolve(results); 
            })
        })
    }


    add_new_media(name, platform, price, condition, mediaType, mediaFields){
        return new Promise((resolve, reject) => {
            this.connection.query(`INSERT INTO Media (Name, Platform, Price, \`Condition\`) VALUES (${this.connection.escape(name)}, ${this.connection.escape(platform)}, ${this.connection.escape(price)}, ${this.connection.escape(condition)})`, async (err, results, fi) =>{
                if(err){
                    return reject(err)
                }else{

                    const id = await this.get_last_id();

                    switch(mediaType){
                        case 'game':
                            await this._add_new_game(id, mediaFields).catch(err =>{
                                reject(err);
                            });
                            break;
                        case 'dlc':
                            await this._add_new_hardware(id, mediaFields).catch(err =>{
                                reject(err);
                            });
                            break;
                        case 'video':
                            await this._add_new_video(id, mediaFields).catch(err =>{
                                reject(err);
                            });
                            break;
                        case 'software':
                            await this._add_new_software(id, mediaFields).catch(err =>{
                                reject(err);
                            });;
                            break;
                        case 'hardware':
                            await this._add_new_hardware(id, mediaFields).catch(err =>{
                                reject(err);
                            });
                            break;
                        default:
                            reject(new Error("Invalid media type"))
                    }

                    return resolve(results);
                }
            });
        })
    }
    
    add_phone_numbers(id, arr){
        return new Promise((resolve, reject) => {
            arr.forEach((element) => {
                this.connection.query(
                    `INSERT INTO Phone_numbers (Person_ID, Phone_number) VALUES (${id}, ${this.connection.escape(element)})`,
                    (err, results, fields) => {
                        return err ? reject(err) : resolve(results);  
                    }
                );
            });
        })
    
    }

    get_media_by_id(id){
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT * FROM Media WHERE Media.Media_ID=?", [id], (err, results, fields) => {
                return err ? reject(err) : resolve(results);
            })
        })
    }

    _add_DLC(media){
        return new Promise((resolve, reject) => {

            this.connection.query(
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
                    }
                }
            );

        })
    }


    get_all_media(){
        return new Promise((resolve, reject) => {
            const query = `SELECT Media_ID, Name, Platform, User_rating, Price, \`Condition\`, Game.Genre AS 'Game Genre', ESRB_Rating, Hardware.Type AS 'Hardware Type', Video.Genre AS 'Video Genre', MPAA_Rating, Software.Type AS 'Software Type'
            FROM Media LEFT JOIN Video ON Video.Video_ID=Media.Media_ID 
            LEFT JOIN Software ON Software.Software_ID=Media.Media_ID 
            LEFT JOIN Game ON Game.Game_ID=Media.Media_ID 
            LEFT JOIN Hardware ON Hardware.Hardware_ID=Media.Media_ID 
            LEFT JOIN Media_Companies ON Media_Companies.Media=Media.Media_ID`


            this.connection.query(query, (err, results, fields) =>{
                return err ? reject(err) : resolve(results);
            })
        })
    }


    search(searchQuery='\'%%\''){
        return new Promise((resolve, reject) => {
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
                               OR Hardware.Type LIKE ${searchQuery} ORDER BY Media_ID`;
        
                // Get all of the media in the database
                this.connection.query(query, async (err, allMedia, fi) => {
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

                        return resolve(await this._add_DLC(send));
                    } else {
                        // some error reject the promise
                        return reject(err);
                    }
                });
            })
    }
}




module.exports = Queries;
