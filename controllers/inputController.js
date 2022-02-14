const e = require('express');
const mysql = require('mysql2/promise');
const config = require('../config/config'); // nodes

const inputController = {

    getHomePage: function(req, res){
        res.render('main');
    },

    resetCaseTwoAndThree: async function (req,res){
        const movie_id = 6;  // (Can be edited)
        const movie_year = 1971  // (Can be edited)
        const query2 = "UPDATE movies SET movie_year = 1971 WHERE movie_id = :x"
        const node1check = req.body.checknodeone;
        const node2check = req.body.checknodetwo;
        const node3check = req.body.checknodethree;

        const node1 = await mysql.createConnection(config.db1);
        const node2 = await mysql.createConnection(config.db2);

        console.log("------ Node Status ------");

        if(node1check == '1')
        {
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
        }

        if(node2check == '1')
        {
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
        }    

        if(node3check == '1')
        {
            
        }
            
        console.log("-------------------------");

        node1.config.namedPlaceholders = true;
        node2.config.namedPlaceholders = true;

        console.log("\n-------------------- RESET Starts Here (Node 1) ------------------");
        console.log("SQL: " + query2 );
        console.log("movie_id: " + movie_id );
        console.log("movie_year: " + movie_year + "\n");

        // Transaction Start (NODE 1)
        await node1.beginTransaction();

        try{
            // SQL Statement 1
            if(node1check == '1')
            {
                const data = await node1.execute(query2, {x: movie_id}, (err,rows) => {
                });
                
                if(data[0].changedRows == 0)
                {
                    console.log("Nothing to reset in Node 1");
                }else console.log(data[0].info);
                
            }
            
            if(node2check == '1')
            {
                const data2 = await node2.execute(query2, {x: movie_id}, (err,rows) => {
                });
    
                if(data2[0].changedRows == 0)
                {
                    console.log("Nothing to reset in Node 2");
                }else console.log(data2[0].info);

            }
            
            if(node1check == '1')
            {
                await node1.commit();
                console.log("\nReset Complete\n");
            }
            // Commit to confirm Transaction
            // await node1.commit();
            // console.log("\nReset Complete\n");

        }catch (err) {
            // Roll back Portion
            console.error(`Error Occured trying to fetch Case 1: ${err.message}`, err);
            if(node1check == '1')
            {
                node1.rollback();
                console.info('Rollback successful');
            }
            else
            {
                console.log('Rollback unsuccessful');
            }
            return `Error selecting data`;

        }

        node1.end();
        node2.end();

        res.redirect('/')
    },

    // Case one: READ ONLY
    getCaseOneResult: async function(req, res){
        const isolevel = req.body.isolevel;
        const node1check = req.body.checknodeone;
        const node2check = req.body.checknodetwo;
        const node3check = req.body.checknodethree;

        console.log("isoLevel = " + isolevel);

        const movie_id = 6;  // (Can be edited)
        const movie_year = 1975  // (Can be edited)
        const query1 = "SELECT * FROM movies WHERE movie_id= :x"

        // Connects to node 1
        const node1 = await mysql.createConnection(config.db1);
        const node2 = await mysql.createConnection(config.db2);

        console.log("------ Node Status ------");

        if(node1check == '1')
        {
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
        }

        if(node2check == '1')
        {
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
        }    

        if(node3check == '1')
        {

        }
       
        console.log("-------------------------");

        // makes sql read arrays as '?' https://github.com/sidorares/node-mysql2/blob/master/documentation/Extras.md
        node1.config.namedPlaceholders = true;
        node2.config.namedPlaceholders = true;
        
        // Set Transaction Level (MUST BE FROM DROP DOWN)
        console.log("\n------------  Isolation Level ------------");
        if(isolevel == '1')
        {
            if(node1check == '1')
            {
                await node1.execute("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED");
            }
            
            if(node2check == '1')
            {
                await node2.execute("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED");
            }
            
            if(node3check == '1')
            {
                await node3.execute("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED");
            }

            if (node1check == '1' || node2check == '1' || node3check == '1')
            {
                console.log("             'READ UNCOMMITTED'");
            }
            
        }

        if(isolevel == '2')
        {
            if(node1check == '1')
            {
                await node1.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
            }

            if(node2check == '1')
            {
                await node2.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
            }
            
            if(node3check == '1')
            {
                await node3.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
            }

            if (node1check == '1' || node2check == '1' || node3check == '1')
            {
                console.log("             'READ COMMITTED'");
            }
            
        }

        if(isolevel == '3')
        {
            if(node1check == '1')
            {
                await node1.execute("SET TRANSACTION ISOLATION LEVEL READ REPEATABLE");
                
            }
            
            if(node2check == '1')
            {
                await node2.execute("SET TRANSACTION ISOLATION LEVEL READ REPEATABLE");
            }         

            if(node3check == '1')
            {
                await node3.execute("SET TRANSACTION ISOLATION LEVEL READ REPEATABLE");
            }

            if (node1check == '1' || node2check == '1' || node3check == '1')
            {
                console.log("             'READ REPEATABLE'");
            }
        }

        if(isolevel == '4')
        {
            if(node1check == '1')
            {
                await node1.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");
            }
            
            if(node2check == '1')
            {
                await node2.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");
            }

            if(node3check == '1')
            {
                await node3.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");
            }
            if (node1check == '1' || node2check == '1' || node3check == '1')
            {
                console.log("             'SERIALIZABLE'");
            }
        }
        console.log("------------------------------------------");

        console.log("\n-------------------- Transaction 1 Starts Here (Node 1) ------------------");
        console.log("SQL: " + query1 );
        console.log("movie_id: " + movie_id );
        console.log("movie_year: " + movie_year + "\n");


        // Transaction Start (NODE 1)

        if(node1check == '1')
        {
            await node1.beginTransaction();

            try{
                // SQL Statement 1
                const data = await node1.execute( query1, {x: movie_id}, (err,rows) => {
                });
                
                console.log(data[0]);
    
                // Commit to confirm Transaction
                await node1.commit();
                console.log("Transaction Complete");
    
            }catch (err) {
                // Roll back Portion
                console.error(`Error Occured trying to fetch Case 1: ${err.message}`, err);
                node1.rollback();
                console.info('Rollback successful');
                return `Error selecting data`;
    
            }
        }
                  
            console.log("");
            //console.log(req.body.select);
        console.log("--------------------------------------------------------------------------\n");

        console.log("\n-------------------- Transaction 2 Starts Here (Node 2) ------------------");
        console.log("SQL: " + query1 );
        console.log("movie_id: " + movie_id );
        console.log("movie_year: " + movie_year + "\n");

        if(node2check == '1')
        {
            await node2.beginTransaction();

            try{
                // SQL Statement 1
                const data = await node2.execute(query1, {x: movie_id}, (err,rows) => {
                });
                
                console.log(data[0]);
    
                // Commit to confirm Transaction
                await node2.commit();
                console.log("Transaction Complete");
    
            }catch (err) {
                // Roll back Portion
                console.error(`Error Occured trying to fetch Case 1: ${err.message}`, err);
                node2.rollback();
                console.info('Rollback successful');
                return `Error selecting data`;
    
            }
        }

        // Transaction Start (NODE 1)
        

        
            console.log("");
            //console.log(req.body.select);
            res.redirect('/')

            console.log("--------------------------------------------------------------------------\n");

            node1.end();
            node2.end();

    },

    // Case Two: READ and WRITE
    getCaseTwoResult: async function(req, res){
        const isolevel = req.body.isolevel;
        const node1check = req.body.checknodeone;
        const node2check = req.body.checknodetwo;
        const node3check = req.body.checknodethree;
        
        console.log("isoLevel = " + isolevel);

        const movie_id = 6;  // (Can be edited)
        const movie_year = 1975;  // (Can be edited)
        const query1 = "SELECT * FROM movies WHERE movie_id= :x";
        const query2 = "UPDATE movies SET movie_year = :y WHERE movie_id = :x";

        // Connects to node 1
        const node1 = await mysql.createConnection(config.db1);
        const node2 = await mysql.createConnection(config.db2);

        console.log("------ Node Status ------");

        if(node1check == '1')
        {
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
        }

        if(node2check == '1')
        {
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
        }  
        console.log("-------------------------");

        // makes sql read arrays as '?' https://github.com/sidorares/node-mysql2/blob/master/documentation/Extras.md
        node1.config.namedPlaceholders = true;
        node2.config.namedPlaceholders = true;
        
        // Set Transaction Level (MUST BE FROM DROP DOWN)
        console.log("\n------------  Isolation Level ------------");
        if(isolevel == '1')
        {
            if(node1check == '1')
            {
                await node1.execute("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED");
            }
            
            if(node2check == '1')
            {
                await node2.execute("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED");
            }
            
            if(node3check == '1')
            {
                await node3.execute("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED");
            }

            if (node1check == '1' || node2check == '1' || node3check == '1')
            {
                console.log("             'READ UNCOMMITTED'");
            }
            
        }

        if(isolevel == '2')
        {
            if(node1check == '1')
            {
                await node1.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
            }

            if(node2check == '1')
            {
                await node2.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
            }
            
            if(node3check == '1')
            {
                await node3.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
            }

            if (node1check == '1' || node2check == '1' || node3check == '1')
            {
                console.log("             'READ COMMITTED'");
            }
            
        }

        if(isolevel == '3')
        {
            if(node1check == '1')
            {
                await node1.execute("SET TRANSACTION ISOLATION LEVEL READ REPEATABLE");
                
            }
            
            if(node2check == '1')
            {
                await node2.execute("SET TRANSACTION ISOLATION LEVEL READ REPEATABLE");
            }         

            if(node3check == '1')
            {
                await node3.execute("SET TRANSACTION ISOLATION LEVEL READ REPEATABLE");
            }

            if (node1check == '1' || node2check == '1' || node3check == '1')
            {
                console.log("             'READ REPEATABLE'");
            }
        }

        if(isolevel == '4')
        {
            if(node1check == '1')
            {
                await node1.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");
            }
            
            if(node2check == '1')
            {
                await node2.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");
            }

            if(node3check == '1')
            {
                await node3.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");
            }
            if (node1check == '1' || node2check == '1' || node3check == '1')
            {
                console.log("             'SERIALIZABLE'");
            }
        }
        console.log("------------------------------------------");

        console.log("\n-------------------- Transaction 1 Starts Here (Node 1) ------------------");
        console.log("SQL: " + query1 );
        console.log("movie_id: " + movie_id );


        if(node1check == '1')
        {
            await node1.beginTransaction();

            try{
                // SQL Statement 1
                const data = await node1.execute( query1, {x: movie_id}, (err,rows) => {
                });
                
                console.log(data[0]);
    
                // Commit to confirm Transaction
                await node1.commit();
                console.log("Transaction Complete");
    
            }catch (err) {
                // Roll back Portion
                console.error(`Error Occured trying to fetch Case 1: ${err.message}`, err);
                node1.rollback();
                console.info('Rollback successful');
                return `Error selecting data`;
    
            }
        }
        // Transaction Start (NODE 1)
        

    
            console.log("");
            //console.log(req.body.select);

        console.log("--------------------------------------------------------------------------\n");

        console.log("\n-------------------- Transaction 2 Starts Here (Node 2) ------------------");
        console.log("SQL: " + query2 );
        console.log("movie_id: " + movie_id );
        console.log("movie_year: " + movie_year + "\n");

        if(node2check == '1')
        {
             // Transaction Start (NODE 1)
            await node2.beginTransaction();

            try{
                // SQL Statement 2
                const data = await node2.execute(query2, {x: movie_id, y: movie_year}, (err,rows) => {
                });
                
                console.log(data[0].info);

                const data2 = await node2.execute(query1, {x: movie_id}, (err,rows) => {
                });
                // console.log(data2[0]);

                const data3 = await node1.execute(query1, {x: movie_id}, (err,rows) => {
                });
                // console.log(data3[0]);

                // COPY data Node 2 to Node 1
                if(data2[0] != data3[0]) {
                    await node1.execute(query2, {x: movie_id, y: movie_year}, (err,rows) => {
                    });
                }

                // Commit to confirm Transaction
                await node2.commit();
                console.log("Transaction Complete");

            }catch (err) {
                // Roll back Portion
                console.error(`Error Occured trying to fetch Case 2: ${err.message}`, err);
                node2.rollback();
                console.info('Rollback successful');
                return `Error selecting data`;

            }
        }

       

            console.log("");
            //console.log(req.body.select);
            res.redirect('/')

            console.log("--------------------------------------------------------------------------\n");

            node1.end();
            node2.end();
    },

    // Case Three:  WRITE and WRITE
    getCaseThreeResult: async function(req, res){
        const isolevel = req.body.isolevel;
        const node1check = req.body.checknodeone;
        const node2check = req.body.checknodetwo;
        const node3check = req.body.checknodethree;
        
        console.log("isoLevel = " + isolevel);

        // Transaction 1 Values
        const movie_id_t1 = 6;  // (Can be edited)
        const movie_year_t1 = 1975;  // (Can be edited)

        // Transaction 2 Values
        const movie_id_t2 = 6;  // (Can be edited)
        const movie_year_t2 = 1971;  // (Can be edited)

        // Queries
        const query1 = "SELECT * FROM movies WHERE movie_id= :x"
        const query2 = "UPDATE movies SET movie_year = :y WHERE movie_id = :x";
        

        // Connects to node 1
        const node1 = await mysql.createConnection(config.db1);
        const node2 = await mysql.createConnection(config.db2);

        console.log("------ Node Status ------");

        const node1Status = node1.connect(function(err) {
        });
        if(node1check == '1')
        {
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
        }

        if(node2check == '1')
        {
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
        }  
       
        console.log("-------------------------");

        // makes sql read arrays as '?' https://github.com/sidorares/node-mysql2/blob/master/documentation/Extras.md
        node1.config.namedPlaceholders = true;
        node2.config.namedPlaceholders = true;
        
        // Set Transaction Level (MUST BE FROM DROP DOWN)
        console.log("\n------------  Isolation Level ------------");

        if(isolevel == '1')
        {
            if(node1check == '1')
            {
                await node1.execute("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED");
            }
            
            if(node2check == '1')
            {
                await node2.execute("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED");
            }
            
            if(node3check == '1')
            {
                await node3.execute("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED");
            }

            if (node1check == '1' || node2check == '1' || node3check == '1')
            {
                console.log("             'READ UNCOMMITTED'");
            }
            
        }

        if(isolevel == '2')
        {
            if(node1check == '1')
            {
                await node1.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
            }

            if(node2check == '1')
            {
                await node2.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
            }
            
            if(node3check == '1')
            {
                await node3.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
            }

            if (node1check == '1' || node2check == '1' || node3check == '1')
            {
                console.log("             'READ COMMITTED'");
            }
            
        }

        if(isolevel == '3')
        {
            if(node1check == '1')
            {
                await node1.execute("SET TRANSACTION ISOLATION LEVEL READ REPEATABLE");
                
            }
            
            if(node2check == '1')
            {
                await node2.execute("SET TRANSACTION ISOLATION LEVEL READ REPEATABLE");
            }         

            if(node3check == '1')
            {
                await node3.execute("SET TRANSACTION ISOLATION LEVEL READ REPEATABLE");
            }

            if (node1check == '1' || node2check == '1' || node3check == '1')
            {
                console.log("             'READ REPEATABLE'");
            }
        }

        if(isolevel == '4')
        {
            if(node1check == '1')
            {
                await node1.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");
            }
            
            if(node2check == '1')
            {
                await node2.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");
            }

            if(node3check == '1')
            {
                await node3.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");
            }
            if (node1check == '1' || node2check == '1' || node3check == '1')
            {
                console.log("             'SERIALIZABLE'");
            }
        }
        
        console.log("------------------------------------------");

        console.log("\n-------------------- Transaction 1 Starts Here (Node 1) ------------------");
        console.log("SQL: " + query2 );
        console.log("movie_id: " + movie_id_t1 );
        console.log("movie_year: " + movie_year_t1  + "\n");

        if(node1check == '1')
        {
            // Transaction Start (NODE 1)
            await node1.beginTransaction();

            try{
                // SQL Statement 1
                const data = await node1.execute(query2, {x: movie_id_t1, y: movie_year_t1}, (err,rows) => {
                });
                
                console.log(data[0].info);

                const data2 = await node1.execute(query1, {x: movie_id_t1}, (err,rows) => {
                });
                // console.log(data2[0]);

                const data3 = await node2.execute(query1, {x: movie_id_t1}, (err,rows) => {
                });
                // console.log(data3[0]);

                // COPY data Node 2 to Node 1
                if(data2[0] != data3[0]) {
                    await node2.execute(query2, {x: movie_id_t1, y: movie_year_t1}, (err,rows) => {
                    });
                }

                // Commit to confirm Transaction
                await node1.commit();
                console.log("Transaction Complete");

            }catch (err) {
                // Roll back Portion
                console.error(`Error Occured trying to fetch Case 1: ${err.message}`, err);
                node1.rollback();
                console.info('Rollback successful');
                return `Error selecting data`;

            }

        }

       
    
            console.log("");
            //console.log(req.body.select);

        console.log("--------------------------------------------------------------------------\n");

        console.log("\n-------------------- Transaction 2 Starts Here (Node 2) ------------------");
        console.log("SQL: " + query2 );
        console.log("movie_id: " + movie_id_t2 );
        console.log("movie_year: " + movie_year_t2 + "\n");

        if(node2check == '1')
        {
            // Transaction Start (NODE 1)
            await node2.beginTransaction();

            try{
                // SQL Statement 2
                const data = await node2.execute(query2, {x: movie_id_t2, y: movie_year_t2}, (err,rows) => {
                });
                
                console.log(data[0].info);

                const data2 = await node2.execute(query1, {x: movie_id_t2}, (err,rows) => {
                });
                // console.log(data2[0]);

                const data3 = await node1.execute(query1, {x: movie_id_t2}, (err,rows) => {
                });
                // console.log(data3[0]);

                if(data2[0] != data3[0]) {
                    await node1.execute(query2, {x: movie_id_t2, y: movie_year_t2}, (err,rows) => {
                    });
                }

                // Commit to confirm Transaction
                await node2.commit();
                console.log("Transaction Complete");

            }catch (err) {
                // Roll back Portion
                console.error(`Error Occured trying to fetch Case 2: ${err.message}`, err);
                node2.rollback();
                console.info('Rollback successful');
                return `Error selecting data`;

            }
        }
        

            console.log("");
            //console.log(req.body.select);
            res.redirect('/')

            console.log("--------------------------------------------------------------------------\n");

            node1.end();
            node2.end();

    },

    getTestFive: function(req, res){

    },

}

module.exports = inputController;