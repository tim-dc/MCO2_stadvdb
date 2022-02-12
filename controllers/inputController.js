const mysql = require('mysql2/promise');
const config = require('../config/config'); // nodes

const inputController = {

    getHomePage: function(req, res){
        res.render('main');
    },

    // CASE ONE: READ ONLY
    getCaseOneResult: async function(req, res){
        const isolevel = req.body.select;

        console.log(isolevel);

        const movie_id = 3;  // (Can be edited)
        const movie_year = 1975  // (Can be edited)

        // Connects to node 1
        const node1 = await mysql.createConnection(config.db1);

        node1.connect(function(err) {
            if (err) {
            return console.error('error: ' + err.message);
            }
        
            // NODE 2 CONNECTION
            console.log('Node1 is Active.');
        });

        // makes sql read arrays as '?' https://github.com/sidorares/node-mysql2/blob/master/documentation/Extras.md
        node1.config.namedPlaceholders = true;
        
        // Set Transaction Level (MUST BE FROM DROP DOWN)
        await node1.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
        console.log("Isolation level is now 'READ COMMITTED'");


        // BEFORE TRANSACTION
        node1.query("SELECT * FROM movies WHERE movie_id= :x", {x: movie_id}, (err,rows) => {
            if (err){
                throw err;
            }
            console.log("Pre-transaction (case 1): ");
            console.log(rows);
            return callback(rows);  
        });


        console.log("TRANSACTION STARTS HERE ");


        // Transaction Start
        await node1.beginTransaction();

        try{
            // SQL Statement 1
            await node1.execute( "SELECT * FROM movies WHERE movie_id= :x", {x: movie_id}, (err,rows) => {
            });

            console.log("Selected movie_id = 6")
            
            // SQL Statement 2
            // await node1.execute("SELECT * movies FROM  movie_year = :x WHERE movie_id = :y", {x: movie_year, y:movie_id},  (err,rows) => {
            // });

            console.log("Updated year to 1975");

            // Commit to confirm Transaction
            await node1.commit();

        }catch (err) {
            // Roll back Portion
            console.error(`Error Occured trying to fetch Case 1: ${err.message}`, err);
            node1.rollback();
            console.info('Rollback successful');
            return `Error selecting data`;

        }
            node1.end();
            console.log("");
            //console.log(req.body.select);
            res.redirect('/')
    },

    // CASE TWO: READ AND WRITE
    getCaseTwoResult: async function(req, res){
       
        console.log("hatdog");
        
        const movie_id = 6;  // (Can be edited)
        const movie_year = 1975  // (Can be edited)

        // Connects to node 1
        const node1 = await mysql.createConnection(config.db1);

        node1.connect(function(err) {
            if (err) {
            return console.error('error: ' + err.message);
            }
        
            // NODE 2 CONNECTION
            console.log('Node1 is Active.');
        });

        node1.config.namedPlaceholders = true;

        // Set Transaction Level (MUST BE FROM DROP DOWN)
        await node1.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
        console.log("Isolation level is now 'READ COMMITTED'");

        // Transaction Start
        await node1.beginTransaction();

        try{
            // SQL Statement 1
            await node1.execute( "SELECT * FROM movies WHERE movie_id= :x", {x: movie_id}, (err,rows) => {
            });

            console.log("Selected movie_id = 6")
            
            // SQL Statement 2
            await node1.execute("UPDATE movies SET movie_year = :x WHERE movie_id = :y", {x: movie_year, y:movie_id},  (err,rows) => {
            });

            console.log("Updated year to 1975");

            // Commit to confirm Transaction
            await node1.commit();

        }catch (err) {
            // Roll back Portion
            console.error(`Error Occured trying to fetch Case 1: ${err.message}`, err);
            node1.rollback();
            console.info('Rollback successful');
            return `Error selecting data`;

        }
            node1.end();
            console.log("");

        res.redirect('/')
    }





}

module.exports = inputController;