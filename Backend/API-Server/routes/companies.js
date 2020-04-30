module.exports = function(connection){
    var express = require('express');
    var router = express.Router();
    var sql_queries = require('../queries.js')



    router.get("/:type", async (req, res)=>{
        try {

            switch(req.params['type']){
                case "publishers":
                    res.send(await sql_queries.get_publishers(connection));
                    break;
                case "developers":
                    res.send(await sql_queries.get_developers(connection));
                    break;
                case "manufacturers":
                    res.send(await sql_queries.get_manufacturers(connection));
                    break;
                default:
                    res.sendStatus(400);
            }
            
        } catch (error) {
            res.send(500);
        }
 
    })



    return router;
}