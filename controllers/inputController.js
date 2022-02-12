const mysql = require('mysql2/promise');
const config = require('../config/config'); // nodes

const inputController = {

    getHomePage: function(req, res){
        res.render('main');
    },

    // CASE ONE: READ ONLY
    getCaseOneResult: async function(req, res){
        const isolevel = req.body.select;

        console.log("isoLevel = " + isolevel);

        const movie_id = 6;  // (Can be edited)
        const movie_year = 1975  // (Can be edited)
        const query1 = "SELECT * FROM movies WHERE movie_id= :x"

        // Connects to node 1
        const node1 = await mysql.createConnection(config.db1);
        const node2 = await mysql.createConnection(config.db2);

        console.log("------ Node Status ------");

        const node1Status = node1.connect(function(err) {
        });
        try {
            if(node1Status != null)
            {
                console.log('    Node1 is Active.');
            }else console.log('    Node1 is OFFLINE.');
        }catch (error) {
            return error;
        }
       
        
        const node2Status = node2.connect(function(err) {
        });
        try {
            if(node2Status != null)
            {
                console.log('    Node2 is Active.');
            }else console.log('    Node2 is OFFLINE.');
        }catch (error) {
            return error;
        }
       
        console.log("-------------------------");

        // makes sql read arrays as '?' https://github.com/sidorares/node-mysql2/blob/master/documentation/Extras.md
        node1.config.namedPlaceholders = true;
        node2.config.namedPlaceholders = true;
        
        // Set Transaction Level (MUST BE FROM DROP DOWN)
        console.log("\n------------  Isolation Level ------------");
        await node1.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
        await node2.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
        console.log("             'READ COMMITTED'");
        console.log("------------------------------------------");

        console.log("\n-------------------- Transaction Starts Here ---------------------");
  
        // Transaction Start (NODE 1)
        await node1.beginTransaction();

        try{
            // SQL Statement 1
            const data = await node1.execute( query1, {x: movie_id}, (err,rows) => {
            });
            
            console.log(data[0]);

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

            node1.end(); // Close connection
            console.log("");
            //console.log(req.body.select);
            res.redirect('/')

        console.log("------------------------------------------------------------------\n");

    },

    // CASE TWO: READ AND WRITE
    getCaseTwoResult: async function(req, res){
        const isolevel = req.body.select;

        console.log("isoLevel = " + isolevel);

        const movie_id = 15;  // (Can be edited)
        const movie_year = 1975  // (Can be edited)
        const query1 = "SELECT * FROM movies WHERE movie_id= :x"

        // Connects to node 1
        const node1 = await mysql.createConnection(config.db1);
        const node2 = await mysql.createConnection(config.db2);

        // NODE 1 CONNECTION TEST
        console.log("------ Node Status ------");

        const node1Status = node1.connect(function(err) {
        });
        try {
            if(node1Status != null)
            {
                console.log('    Node1 is Active.');
            }else console.log('    Node1 is OFFLINE.');
        }catch (error) {
            return error;
        }
       
        
        const node2Status = node2.connect(function(err) {
        });
        try {
            if(node2Status != null)
            {
                console.log('    Node2 is Active.');
            }else console.log('    Node2 is OFFLINE.');
        }catch (error) {
            return error;
        }
       
        console.log("-------------------------");

        // makes sql read arrays as '?' https://github.com/sidorares/node-mysql2/blob/master/documentation/Extras.md
        node1.config.namedPlaceholders = true;
        node2.config.namedPlaceholders = true;
        
        // Set Transaction Level (MUST BE FROM DROP DOWN)
        console.log("\n------------  Isolation Level ------------");
        await node1.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
        await node2.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
        console.log("             'READ COMMITTED'");
        console.log("------------------------------------------");

        console.log("\n-------------------- Transaction Starts Here ---------------------");

        // Transaction Start (NODE 1)
        await node1.beginTransaction();

        try{
            // SQL Statement 1
            const data = await node1.execute( query1, {x: movie_id}, (err,rows) => {
            });
            
            console.log(data[0]);

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

            node1.end(); // Close connection
            //console.log(req.body.select);
            res.redirect('/')

        console.log("------------------------------------------------------------------\n");
    },

   
    

}

module.exports = inputController;