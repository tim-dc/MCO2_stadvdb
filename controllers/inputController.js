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
        const query1 = "SELECT * FROM movies WHERE movie_id= :x"

        // Connects to node 1
        const node1 = await mysql.createConnection(config.db1);
        const node2 = await mysql.createConnection(config.db2);

        // NODE 1 CONNECTION TEST
        const node1Status = node1.connect(function(err) {
            if (err) {
            return console.error('error: ' + err.message);
            }
        
            // NODE 1 CONNECTION
            console.log('Node1 is Active.');
        });

        console.log(node1Status);
        
        // NODE 2 CONNECTION TEST
        node2.connect(function(err) {
            if (err) {
            return console.error('error: ' + err.message);
            }
        
            // NODE 2 CONNECTION
            console.log('Node2 is Active.');
        });

        // makes sql read arrays as '?' https://github.com/sidorares/node-mysql2/blob/master/documentation/Extras.md
        node1.config.namedPlaceholders = true;
        node2.config.namedPlaceholders = true;
        
        // Set Transaction Level (MUST BE FROM DROP DOWN)
        await node1.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
        await node2.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
        console.log("Isolation level is now 'READ COMMITTED'");

        console.log("TRANSACTION STARTS HERE ");


        // Transaction Start (NODE 1)
        await node1.beginTransaction();

        try{
            // SQL Statement 1
            const data = await node1.execute( "SELECT * FROM movies WHERE movie_id= :x", {x: movie_id}, (err,rows) => {
            });
            
            console.log(data[0]);
            // console.log("Updated year to 1975");

            // Commit to confirm Transaction
            await node1.commit();
            console.log("Committed");

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


        // NODE 2 Transaction
        // await node2.beginTransaction();

    },

    // CASE TWO: READ AND WRITE
    getCaseTwoResult: async function(req, res){
        
        // console.log("hatdog");
        
        // const movie_id = 6;  // (Can be edited)
        // const movie_year = 1975  // (Can be edited)

        // // Connects to node 1
        // const node1 = await mysql.createConnection(config.db1);

        // node1.connect(function(err) {
        //     if (err) {
        //     return console.error('error: ' + err.message);
        //     }
        
        //     // NODE 2 CONNECTION
        //     console.log('Node1 is Active.');
        // });

        // node1.config.namedPlaceholders = true;

        // // Set Transaction Level (MUST BE FROM DROP DOWN)
        // await node1.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
        // console.log("Isolation level is now 'READ COMMITTED'");

        // // Transaction Start
        // await node1.beginTransaction();

        // try{
        //     // SQL Statement 1
        //     await node1.execute( "SELECT * FROM movies WHERE movie_id= :x", {x: movie_id}, (err,rows) => {
        //     });

        //     console.log("Selected movie_id = 6")
            
        //     // SQL Statement 2
        //     await node1.execute("UPDATE movies SET movie_year = :x WHERE movie_id = :y", {x: movie_year, y:movie_id},  (err,rows) => {
        //     });

        //     console.log("Updated year to 1975");

        //     // Commit to confirm Transaction
        //     await node1.commit();

        // }catch (err) {
        //     // Roll back Portion
        //     console.error(`Error Occured trying to fetch Case 1: ${err.message}`, err);
        //     node1.rollback();
        //     console.info('Rollback successful');
        //     return `Error selecting data`;

        // }
        //     node1.end();
        //     console.log("");

        // res.redirect('/')
    }





}

module.exports = inputController;