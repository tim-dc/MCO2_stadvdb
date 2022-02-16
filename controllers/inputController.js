const e = require('express');
const res = require('express/lib/response');
const mysql = require('mysql2/promise');
const config = require('../config/config'); // nodes
const logger = require('../config/logger');
var versionExists = false;


async function waitSleep(ms) {
    console.log(1);
    await sleep(ms);
  }
  
function sleep(ms) {
return new Promise((resolve) => {
    setTimeout(resolve, ms);
});
}

const inputController = {

    getHomePage:function(req, res){
      
        res.render('main');

    },
    createVersion: async function(req,res){

        if(!versionExists){
            const node1 = await mysql.createConnection(config.db1);
            const node2 = await mysql.createConnection(config.db2);
            const node3 = await mysql.createConnection(config.db3);
    
            const createVersionTable = "CREATE TABLE version (versionNo int);"
            const insertVersionZero = "INSERT INTO version (versionNo) VALUES(0);"
    
            await node1.beginTransaction()
            try{
                    await node1.execute(createVersionTable,[], (err,rows)=>{});
                    await node1.execute(insertVersionZero,[], (err, rows)=>{});
                    await node1.commit();
            }
            catch(err){
    
            }
    
            await node2.beginTransaction()
            try{
                await node2.execute(createVersionTable,[], (err,rows)=>{});
                await node2.execute(insertVersionZero,[], (err, rows)=>{});
                await node2.commit();
            }
            catch(err){
                
            }
    
            await node3.beginTransaction()
            try{
                await node3.execute(createVersionTable,[], (err,rows)=>{});
                await node3.execute(insertVersionZero,[], (err, rows)=>{});
                await node3.commit();
            }
            catch(err){
                
            }
            console.log("Version Tables created");
            versionExists = true;

            node1.end();
            node2.end();
            node3.end();
        }
        res.redirect('/index');
        
    },

    resetCaseTwoAndThree: async function (req,res){
        const movie_id = 6;  // (Can be edited)
        const movie_year = 1971  // (Can be edited)
        const query2 = "UPDATE movies SET movie_year = :y WHERE movie_id = :x"
        const node1check = req.body.checknodeone;
        const node2check = req.body.checknodetwo;
        const node3check = req.body.checknodethree;

        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        const node1 = await mysql.createConnection(config.db1);
        const node2 = await mysql.createConnection(config.db2);
        const node3 = await mysql.createConnection(config.db3);

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
            const node3Status = node3.connect(function(err) {
            });
            try {
                if(node3Status != null)
                {
                    console.log('    Node3 is Active.');
                }else console.log('    Node3 is OFFLINE.');
            }catch (error) {
                return error;
            }
        }

      
       
        console.log("-------------------------");

        node1.config.namedPlaceholders = true;
        node2.config.namedPlaceholders = true;
        node3.config.namedPlaceholders = true;

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
                const data = await node1.execute(query2, {x: movie_id, y: movie_year}, (err,rows) => {
                });
                
                if(data[0].changedRows == 0)
                {
                    console.log("Nothing to reset in Node 1");
                }else console.log(data[0].info);
                
            }
            
            if(node2check == '1')
            {
                const data2 = await node2.execute(query2, {x: movie_id, y: movie_year}, (err,rows) => {
                });
    
                if(data2[0].changedRows == 0)
                {
                    console.log("Nothing to reset in Node 2");
                }else console.log(data2[0].info);

            }
            

            await node1.commit();
            console.log("\nReset Complete\n");
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
        node3.end();

        res.redirect('/')
    },

    // Case one: READ ONLY
    getCaseOneResult: async function(req, res){
        const isolevel = req.body.isolevel;
        const node1check = req.body.checknodeone;
        const node2check = req.body.checknodetwo;
        const node3check = req.body.checknodethree;

        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        logger.info(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds +  " RUNNING TEST CASE");

        console.log("isoLevel = " + isolevel);
        logger.info("isoLevel = " + isolevel);

        // Connects to node 1
        const node1 = await mysql.createConnection(config.db1);
        const node2 = await mysql.createConnection(config.db2);
        const node3 = await mysql.createConnection(config.db3);

        // Transaction 1 Variables
        const movie_name = '10 minuta';
       
        // Transaction 2 Variables
        const movie_year1 = 1969;
        const movie_year2 = 1971;

        // Queries
        const c1t1 = "SELECT * from movies WHERE movie_name = :x"
        const c2t1 = "SELECT * from movies WHERE movie_year BETWEEN :x AND :y"
        
        console.log("------ Node Status ------");
        
        if(node1check == '1')
        {
            const node1Status = node1.connect(function(err) {
            });
            try {
                if(node1Status != null)
                {
                    console.log('    Node1 is Active.');
                    logger.info('Node Status: Node 1 is Active.');
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
                    logger.info('Node Status: Node 2 is Active.');
                }else console.log('    Node2 is OFFLINE.');
            }catch (error) {
                return error;
            }
        }    
       
        if(node3check == '1')
        {
            const node3Status = node3.connect(function(err) {
            });
            try {
                if(node3Status != null)
                {
                    console.log('    Node3 is Active.');
                    logger.info('Node Status: Node 3 is Active.');
                }else console.log('    Node3 is OFFLINE.');
            }catch (error) {
                return error;
            }
        }    
       
        console.log("-------------------------");
        logger.info("-------------------------");

        // makes sql read arrays as '?' https://github.com/sidorares/node-mysql2/blob/master/documentation/Extras.md
        node1.config.namedPlaceholders = true;
        node2.config.namedPlaceholders = true;
        node3.config.namedPlaceholders = true;
        
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
                logger.info("Isolation Level: READ UNCOMMITTED");
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
                logger.info("Isolation Level: READ COMMITTED");
            }
            
        }

        if(isolevel == '3')
        {
            if(node1check == '1')
            {
                await node1.execute("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ");
                
            }
            
            if(node2check == '1')
            {
                await node2.execute("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ");
            }         

            if(node3check == '1')
            {
                await node3.execute("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ");
            }

            if (node1check == '1' || node2check == '1' || node3check == '1')
            {
                console.log("             'READ REPEATABLE'");
                logger.info("Isolation Level: READ REPEATABLE");
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
                logger.info("Isolation Level: SERIALIZABLE");
            }
        }

        console.log("\n-------------------- Transaction #1 --------------------");
        logger.info("-------------------- Transaction #1 --------------------");
        console.log("Request: What year did this movie come out? (Movie name: 10 minuta) ");
  
        if(node1check == '1'){
            await node1.beginTransaction();
            logger.info("Beginning transaction");

            try{
                const c1trans1 = await node1.execute(c1t1, {x: movie_name}, (err,rows)=>{
                    
                });

                console.log(c1trans1[0]);
                logger.info("Rows fetched: " + c1trans1[0].length);


                await node1.commit();
                console.log("Transaction Complete");
                logger.info("Transaction Complete");
            }
            catch(err){

                console.error(`Error Occured trying to fetch Case 1: ${err.message}`, err);
                logger.info(`Error Occured trying to fetch Case 1: ${err.message}`, err);
                node1.rollback();
                console.info('Rollback successful');
                logger.info('Rollback successful');
                return `Error selecting data`;
            }
        } 

        console.log("\n-------------------- Transaction #2 --------------------");
        logger.info("-------------------- Transaction #2 --------------------");
        console.log("Request: Give me all movies that were released between 1969-1971");
        logger.info("Request: Give me all movies that were released between 1969-1971");


        if(node1check == '1'){
            await node1.beginTransaction();
            try{
                const c1trans2 = await node1.execute(c2t1, {x: movie_year1, y: movie_year2}, (err,rows)=>{});

                console.log(c1trans2[0]);
                logger.info("Rows fetched: " + c1trans2[0].length);

                await node1.commit();
                console.log("Transaction Complete");
                logger.info("Transaction Complete");
            }
            catch(err){

                console.error(`Error Occured trying to fetch Case 1: ${err.message}`, err);
                node1.rollback();
                console.info('Rollback successful');
                logger.info('Rollback successful');
                return `Error selecting data`;
            }
        }


        // console.log("\n-------------------- Transaction 1 Starts Here (Node 1) ------------------");
        // console.log("SQL: " + query1 );
        // console.log("movie_id: " + movie_id );
        // console.log("movie_year: " + movie_year + "\n");


        // // Transaction Start (NODE 1)

        // if(node1check == '1')
        // {
        //     await node1.beginTransaction();

        //     try{
        //         // SQL Statement 1
        //         const data = await node1.execute( query1, {x: movie_id}, (err,rows) => {
        //         });
                
        //         console.log(data[0]);
    
        //         // Commit to confirm Transaction
        //         await node1.commit();
        //         console.log("Transaction Complete");
    
        //     }catch (err) {
        //         // Roll back Portion
        //         console.error(`Error Occured trying to fetch Case 1: ${err.message}`, err);
        //         node1.rollback();
        //         console.info('Rollback successful');
        //         return `Error selecting data`;
    
        //     }
        // }
                  
        //     console.log("");
        //     //console.log(req.body.select);
        // console.log("--------------------------------------------------------------------------\n");

        // // await waitSleep(1000);

        // console.log("\n-------------------- Transaction 2 Starts Here (Node 2) ------------------");
        // console.log("SQL: " + query1 );
        // console.log("movie_id: " + movie_id );
        // console.log("movie_year: " + movie_year + "\n");

        // if(node2check == '1')
        // {
        //     await node2.beginTransaction();

        //     try{
        //         // SQL Statement 1
        //         const data = await node2.execute(query1, {x: movie_id}, (err,rows) => {
        //         });
                
        //         console.log(data[0]);
    
        //         // Commit to confirm Transaction
        //         await node2.commit();
        //         console.log("Transaction Complete");
    
        //     }catch (err) {
        //         // Roll back Portion
        //         console.error(`Error Occured trying to fetch Case 1: ${err.message}`, err);
        //         node2.rollback();
        //         console.info('Rollback successful');
        //         return `Error selecting data`;
    
        //     }
        // }

        // Transaction Start (NODE 1)

        
        

        //After ng bawat transaction dapat meron version number na nagccheck kung consistent ung data sa lahat ng db instances
        console.log("");
        //console.log(req.body.select);
        node1.end();
        node2.end();
        node3.end();
        res.redirect('/versionControl');

        console.log("--------------------------------------------------------------------------\n");
    },

    // Case Two: READ and WRITE
    getCaseTwoResult: async function(req, res){
        const isolevel = req.body.isolevel;
        const node1check = req.body.c2checknodeone;
        const node2check = req.body.c2checknodetwo;
        const node3check = req.body.c2checknodethree;

        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        logger.info(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds +  " RUNNING TEST CASE");
        
        console.log("isoLevel = " + isolevel);
        logger.info("isoLevel = " + isolevel);

        // Transaction 1 & 2
        const movie_id = 262093;  // (Can be edited)
        const movie_name1 = 'Power Rangers Time Force: Temporal Anomaly';

        // Queries
        const c2t1 = "SELECT * from movies WHERE movie_id = :x"
        const c2t2_1 = "SELECT * from movies WHERE movie_id = :x"
        const c2t2_2 = "UPDATE movies SET movie_name = :y WHERE movie_id = :x"
        const c2t2_3 = "SELECT * from movies WHERE movie_id = :x"


        // const movie_year = 1975;  // (Can be edited)
        // const query1 = "SELECT * FROM movies WHERE movie_id= :x";
        // const query2 = "UPDATE movies SET movie_year = :y WHERE movie_id = :x";

        // Connects to node 1
        const node1 = await mysql.createConnection(config.db1);
        const node2 = await mysql.createConnection(config.db2);
        const node3 = await mysql.createConnection(config.db3);


        console.log("------ Node Status ------");

        if(node1check == '1')
        {
            const node1Status = node1.connect(function(err) {
            });
            try {
                if(node1Status != null)
                {
                    console.log('    Node1 is Active.');
                    logger.info('Node Status: Node 1 is Active.');
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
                    logger.info('Node Status: Node 2 is Active.');
                }else console.log('    Node2 is OFFLINE.');
            }catch (error) {
                return error;
            }
        }  
        if(node3check == '1')
        {
            const node3Status = node3.connect(function(err) {
            });
            try {
                if(node3Status != null)
                {
                    console.log('    Node3 is Active.');
                    logger.info('Node Status: Node 3 is Active.');
                }else console.log('    Node3 is OFFLINE.');
            }catch (error) {
                return error;
            }
        }
        console.log("-------------------------");

        // makes sql read arrays as '?' https://github.com/sidorares/node-mysql2/blob/master/documentation/Extras.md
        node1.config.namedPlaceholders = true;
        node2.config.namedPlaceholders = true;
        node3.config.namedPlaceholders = true;

        
        // Set Transaction Level (MUST BE FROM DROP DOWN)
        console.log("------------  Isolation Level ------------");
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
                logger.info("Isolation Level: READ UNCOMMITTED");                
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
                logger.info("Isolation Level: READ COMMITTED");
            }
            
        }

        if(isolevel == '3')
        {
            if(node1check == '1')
            {
                await node1.execute("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ");
                
            }
            
            if(node2check == '1')
            {
                await node2.execute("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ");
            }         

            if(node3check == '1')
            {
                await node3.execute("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ");
            }

            if (node1check == '1' || node2check == '1' || node3check == '1')
            {
                console.log("             'READ REPEATABLE'");
                logger.info("Isolation Level: READ REPEATABLE");
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
                logger.info("Isolation Level: SERIALIZABLE");
            }
        }
        console.log("------------------------------------------");

        console.log("\n-------------------- Transaction #1 --------------------");
        logger.info("-------------------- Transaction #1 --------------------");
        console.log("Request: I want to see this movie again. (Movie Id: 262093");

        
        if(node1check == '1'){
            await node1.beginTransaction();
            logger.info("Beginning transaction");

            try{
                const c2trans1 = await node1.execute(c2t1, {x: movie_id}, (err,rows)=>{});

                console.log(c2trans1[0]);
                logger.info("Rows fetched: " + c2trans1[0].length);

                await node1.commit();
                console.log("Transaction Complete");
                logger.info("Transaction Complete");
            }
            catch(err){

                console.error(`Error Occured trying to fetch Case 1: ${err.message}`, err);
                logger.info(`Error Occured trying to fetch Case 1: ${err.message}`, err);
                node1.rollback();
                console.info('Rollback successful');
                logger.info('Rollback successful');
                return `Error selecting data`;
            }
        }
        
        console.log("\n-------------------- Transaction #2 --------------------");
        logger.info("-------------------- Transaction #2 --------------------");
        console.log("Request: I dont think this was the title of this movie. (Name change: Power Rangers Time Force: Temporal Anomaly");
        logger.info("Request: I dont think this was the title of this movie. (Name change: Power Rangers Time Force: Temporal Anomaly");

        if(node1check == '1'){
            await node1.beginTransaction();
            try{

                const c2trans2_1 = await node1.execute(c2t2_1, {x: movie_id}, (err,rows)=>{});
 
                const c2trans2_2 = await node1.execute(c2t2_2,{x: movie_id, y: movie_name1},  (err,rows)=>{});

                // console.log(c2trans2_2[0].changedRows);
                if(c2trans2_2[0].changedRows == 0)
                {
                    console.log("\nNothing New to add.");
                    logger.info("No changed rows, nothing new to add");
                }else {
                    console.log("[Old Title]\n");
                    console.log(c2trans2_1[0]);
                    logger.info("[Old Title] Rows fetched: " + c2trans2_1[0].length);

                    
                    // console.log(data2[0].info);

                    console.log("\n");

                    const c2trans2_3 = await node1.execute(c2t2_3, {x: movie_id}, (err,rows)=>{});
                    console.log("[New Title]\n");
                    logger.info("[New Title] Rows fetched: " + c2trans2_3[0].length);

                }

                console.log("\n");

                await node1.commit();
                console.log("Transaction Complete");
                logger.info("Transaction Complete");
            }
            catch(err){

                console.error(`Error Occured trying to fetch Case 2: ${err.message}`, err);
                node1.rollback();
                console.info('Rollback successful');
                logger.info('Rollback successful');
                return `Error selecting data`;
            }
        }
    


        // if(node1check == '1')
        // {
        //     await node1.beginTransaction();

        //     try{
        //         // SQL Statement 1
        //         const data = await node1.execute( query1, {x: movie_id}, (err,rows) => {
        //         });
                
        //         console.log(data[0]);
    
        //         // Commit to confirm Transaction
        //         await node1.commit();
        //         console.log("Transaction Complete");
    
        //     }catch (err) {
        //         // Roll back Portion
        //         console.error(`Error Occured trying to fetch Case 1: ${err.message}`, err);
        //         node1.rollback();
        //         console.info('Rollback successful');
        //         return `Error selecting data`;
    
        //     }
        // }
        // // Transaction Start (NODE 1)
        

    
        //     console.log("");
        //     //console.log(req.body.select);

        // console.log("--------------------------------------------------------------------------\n");

        // console.log("\n-------------------- Transaction 2 Starts Here (Node 2) ------------------");
        // console.log("SQL: " + query2 );
        // console.log("movie_id: " + movie_id );
        // console.log("movie_year: " + movie_year + "\n");

        // if(node2check == '1')
        // {
        //      // Transaction Start (NODE 1)
        //     await node2.beginTransaction();

        //     try{
        //         // SQL Statement 2
        //         const data = await node2.execute(query2, {x: movie_id, y: movie_year}, (err,rows) => {
        //         });
                
        //         console.log(data[0].info);

        //         const data2 = await node2.execute(query1, {x: movie_id}, (err,rows) => {
        //         });
        //         // console.log(data2[0]);

        //         const data3 = await node1.execute(query1, {x: movie_id}, (err,rows) => {
        //         });
        //         // console.log(data3[0]);

        //         // COPY data Node 2 to Node 1
        //         if(data2[0] != data3[0]) {
        //             await node1.execute(query2, {x: movie_id, y: movie_year}, (err,rows) => {
        //             });
        //         }

        //         // Commit to confirm Transaction
        //         await node2.commit();
        //         console.log("Transaction Complete");

        //     }catch (err) {
        //         // Roll back Portion
        //         console.error(`Error Occured trying to fetch Case 2: ${err.message}`, err);
        //         node2.rollback();
        //         console.info('Rollback successful');
        //         return `Error selecting data`;

        //     }
        // }

       

            console.log("");
            //console.log(req.body.select);
            node1.end();
            node2.end();
            res.redirect('/versionControl');

            console.log("--------------------------------------------------------------------------\n");

            
    },

    // Case Three:  WRITE and WRITE
    getCaseThreeResult: async function(req, res){
        const isolevel = req.body.isolevel;
        const node1check = req.body.c3checknodeone;
        const node2check = req.body.c3checknodetwo;
        const node3check = req.body.c3checknodethree;

        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        logger.info(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds +  " RUNNING TEST CASE");
        
        console.log("isoLevel = " + isolevel);
        logger.info("isoLevel = " + isolevel);


        // Transaction 1 Values
        const movie_id_t1 = 8855;  // (Can be edited)
        const movie_year_t1 = 6;  // (Can be edited)

        // Transaction 2 Values
        const movie_id_t2 = 4689;  // (Can be edited)
        const movie_year_t2 = 2000;  // (Can be edited)

        // Queries
        const c3t1 = "DELETE from movies WHERE movie_id = :x"
        const c3t2 = "UPDATE movies SET movie_year = :x WHERE movie_id = :y"
        const query1 = "SELECT * FROM movies WHERE movie_id= :x"

        // const query2 = "UPDATE movies SET movie_year = :y WHERE movie_id = :x";
        

        // Connects to node 1
        const node1 = await mysql.createConnection(config.db1);
        const node2 = await mysql.createConnection(config.db2);
        const node3 = await mysql.createConnection(config.db3);


        console.log("------ Node Status ------");

        if(node1check == '1')
        {
            const node1Status = node1.connect(function(err) {
            });
            try {
                if(node1Status != null)
                {
                    console.log('    Node1 is Active.');
                    logger.info('Node Status: Node 1 is Active.');
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
                    logger.info('Node Status: Node 2 is Active.');
                }else console.log('    Node2 is OFFLINE.');
            }catch (error) {
                return error;
            }
        }  
        if(node3check == '1')
        {
            const node3Status = node3.connect(function(err) {
            });
            try {
                if(node3Status != null)
                {
                    console.log('    Node3 is Active.');
                    logger.info('Node Status: Node 3 is Active.');
                }else console.log('    Node3 is OFFLINE.');
            }catch (error) {
                return error;
            }
        }  
       
        console.log("-------------------------");

        // makes sql read arrays as '?' https://github.com/sidorares/node-mysql2/blob/master/documentation/Extras.md
        node1.config.namedPlaceholders = true;
        node2.config.namedPlaceholders = true;
        node3.config.namedPlaceholders = true;

        
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
                logger.info("Isolation Level: READ UNCOMMITTED");
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
                logger.info("Isolation Level: READ COMMITTED");
            }
            
        }

        if(isolevel == '3')
        {
            if(node1check == '1')
            {
                await node1.execute("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ");
                
            }
            
            if(node2check == '1')
            {
                await node2.execute("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ");
            }         

            if(node3check == '1')
            {
                await node3.execute("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ");
            }

            if (node1check == '1' || node2check == '1' || node3check == '1')
            {
                console.log("             'READ REPEATABLE'");
                logger.info("Isolation Level: READ REPEATABLE");
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
                logger.info("Isolation Level: SERIALIZABLE");
            }
        }
        
        console.log("------------------------------------------");
        logger.info("-------------------- Transaction #1 --------------------");
        console.log("\n-------------------- Transaction #1 --------------------");
        console.log("Request: I dont think this movie exists (Movie ID: 8855)");
        logger.info("Request: I dont think this movie exists (Movie ID: 8855)");


        if(node1check == '1'){
            await node1.beginTransaction();
            try{
                const c3trans1 = await node1.execute(c3t1, {x: movie_id_t1}, (err,rows)=>{});

                if(c3trans1[0].info == '')
                {
                    console.log( "\nThis movie id: " + movie_id_t1 +"  does not exist.\n");
                }

                logger.info("Rows fetched: " + c3trans1[0].length);

                
                await node1.commit();
                console.log("Transaction Complete");
                logger.info("Transaction Complete");
            }
            catch(err){

                console.error(`Error Occured trying to fetch Case 1: ${err.message}`, err);
                logger.info(`Error Occured trying to fetch Case 1: ${err.message}`, err);
                node1.rollback();
                console.info('Rollback successful');
                logger.info('Rollback successful');
                return `Error selecting data`;
            }
        }



        console.log("\n-------------------- Transaction #2 --------------------");
        logger.info("-------------------- Transaction #2 --------------------");
        console.log("Request: This movie has a year correction (Movie ID: 4689, 1996 => 2000)");
        logger.info("Request: This movie has a year correction (Movie ID: 4689, 1996 => 2000)");


        if(node1check == '1'){
            await node1.beginTransaction();
            try{
                const c3trans2 = await node1.execute(c3t2, {x: movie_year_t2, y: movie_id_t2}, (err,rows)=>{});
                console.log("\n");
                console.log(c3trans2[0].info);


                if(c3trans2[0].changedRows == 0)
                {
                    console.log("Nothing New to add.\n");
                    logger.info("[Changed Rows] Rows fetched: " + c3trans2[0].length);

                }else {
                    console.log(c3trans2[0].info);

                    console.log("\n");

                    const c3trans2_3 = await node1.execute(query1, {x: movie_id_t2}, (err,rows)=>{});
                    console.log("[New Title]\n");
                    logger.info("[Changed Rows] Rows fetched: " + c3trans2[0].length);
                    
                }

                
                await node1.commit();
                console.log("Transaction Complete");
                logger.info("Transaction Complete");
            }
            catch(err){

                console.error(`Error Occured trying to fetch Case 1: ${err.message}`, err);
                node1.rollback();
                console.info('Rollback successful');
                logger.info("Transaction Complete");
                return `Error selecting data`;
            }
        }

        // console.log("\n-------------------- Transaction 1 Starts Here (Node 1) ------------------");
        // console.log("SQL: " + query2 );
        // console.log("movie_id: " + movie_id_t1 );
        // console.log("movie_year: " + movie_year_t1  + "\n");

        // if(node1check == '1')
        // {
        //     // Transaction Start (NODE 1)
        //     await node1.beginTransaction();

        //     try{
        //         // SQL Statement 1
        //         const data = await node1.execute(query2, {x: movie_id_t1, y: movie_year_t1}, (err,rows) => {
        //         });
                
        //         console.log(data[0].info);

        //         const data2 = await node1.execute(query1, {x: movie_id_t1}, (err,rows) => {
        //         });
        //         // console.log(data2[0]);

        //         const data3 = await node2.execute(query1, {x: movie_id_t1}, (err,rows) => {
        //         });
        //         // console.log(data3[0]);

        //         // COPY data Node 2 to Node 1
        //         if(data2[0] != data3[0]) {
        //             await node2.execute(query2, {x: movie_id_t1, y: movie_year_t1}, (err,rows) => {
        //             });
        //         }

        //         // Commit to confirm Transaction
        //         await node1.commit();
        //         console.log("Transaction Complete");

        //     }catch (err) {
        //         // Roll back Portion
        //         console.error(`Error Occured trying to fetch Case 1: ${err.message}`, err);
        //         node1.rollback();
        //         console.info('Rollback successful');
        //         return `Error selecting data`;

        //     }

        // }

       
    
        //     console.log("");
        //     //console.log(req.body.select);

        // console.log("--------------------------------------------------------------------------\n");

        // console.log("\n-------------------- Transaction 2 Starts Here (Node 2) ------------------");
        // console.log("SQL: " + query2 );
        // console.log("movie_id: " + movie_id_t2 );
        // console.log("movie_year: " + movie_year_t2 + "\n");

        // if(node2check == '1')
        // {
        //     // Transaction Start (NODE 1)
        //     await node2.beginTransaction();

        //     try{
        //         // SQL Statement 2
        //         const data = await node2.execute(query2, {x: movie_id_t2, y: movie_year_t2}, (err,rows) => {
        //         });
                
        //         console.log(data[0].info);

        //         const data2 = await node2.execute(query1, {x: movie_id_t2}, (err,rows) => {
        //         });
        //         // console.log(data2[0]);

        //         const data3 = await node1.execute(query1, {x: movie_id_t2}, (err,rows) => {
        //         });
        //         // console.log(data3[0]);

        //         if(data2[0] != data3[0]) {
        //             await node1.execute(query2, {x: movie_id_t2, y: movie_year_t2}, (err,rows) => {
        //             });
        //         }

        //         // Commit to confirm Transaction
        //         await node2.commit();
        //         console.log("Transaction Complete");

        //     }catch (err) {
        //         // Roll back Portion
        //         console.error(`Error Occured trying to fetch Case 2: ${err.message}`, err);
        //         node2.rollback();
        //         console.info('Rollback successful');
        //         return `Error selecting data`;

        //     }
        // }
        

            console.log("");
            //console.log(req.body.select);
            node1.end();
            node2.end();
            node3.end();
            res.redirect('/versionControl');

            console.log("--------------------------------------------------------------------------\n");

            

    },

    getCaseFourResult: async function(req,res) {
        const isolevel = req.body.isolevel;
        const node1check = req.body.c4checknodeone;
        const node2check = req.body.c4checknodetwo;
        const node3check = req.body.c4checknodethree;

        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        logger.info(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds +  " RUNNING TEST CASE");
        
        console.log("isoLevel = " + isolevel);
        logger.info("isoLevel = " + isolevel);


        // Transaction 1 Values
        const movie_id_t1 = 6;  // (Can be edited)
        const movie_year_t1 = 1975;  // (Can be edited)

        // Transaction 2 Values
        const movie_id_t2 = 6;  // (Can be edited)
        const movie_year_t2 = 1971;  // (Can be edited)

        // Queries
        const query1 = "SELECT * FROM movies WHERE movie_id= :x"
        const query2 = "UPDATE movies SET movie_year =  :y  WHERE movie_id = :x";
        
        // Connects to node 1
        const node1 = await mysql.createConnection(config.db1);
        const node2 = await mysql.createConnection(config.db2);
        const node3 = await mysql.createConnection(config.db3);


        console.log("------ Node Status ------");

        if(node1check == '1')
        {
            const node1Status = node1.connect(function(err) {
            });
            try {
                if(node1Status != null)
                {
                    console.log('    Node1 is Active.');
                    logger.info('Node Status: Node 1 is Active.');
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
                    logger.info('Node Status: Node 2 is Active.');
                }else console.log('    Node2 is OFFLINE.');
            }catch (error) {
                return error;
            }
        }  
        if(node3check == '1')
        {
            const node3Status = node3.connect(function(err) {
            });
            try {
                if(node3Status != null)
                {
                    console.log('    Node3 is Active.');
                    logger.info('Node Status: Node 3 is Active.');
                }else console.log('    Node3 is OFFLINE.');
            }catch (error) {
                return error;
            }
        }  
       
        console.log("-------------------------");

        // makes sql read arrays as '?' https://github.com/sidorares/node-mysql2/blob/master/documentation/Extras.md
        node1.config.namedPlaceholders = true;
        node2.config.namedPlaceholders = true;
        node3.config.namedPlaceholders = true;

        
        // Set Transaction Level (MUST BE FROM DROP DOWN)
        console.log("\n------------  Isolation Level ------------");

        if(isolevel == '1')
        {
            await node1.execute("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED");
            await node2.execute("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED");
            console.log("             'READ UNCOMMITTED'");
            logger.info("Isolation Level: READ UNCOMMITTED");

        }

        if(isolevel == '2')
        {
            await node1.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
            await node2.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
            console.log("             'READ COMMITTED'");
            logger.info("Isolation Level: READ COMMITTED");

        }

        if(isolevel == '3')
        {
            await node1.execute("SET TRANSACTION ISOLATION LEVEL READ REPEATABLE");
            await node2.execute("SET TRANSACTION ISOLATION LEVEL READ REPEATABLE");
            console.log("             'READ REPEATABLE'");
            logger.info("Isolation Level: READ REPEATABLE");

        }

        if(isolevel == '4')
        {
            await node1.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");
            await node2.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");
            console.log("             'SERIALIZABLE'");
            logger.info("Isolation Level: SERIALIZABLE");

        }
        
        console.log("------------------------------------------");

        console.log("\n-------------------- Transaction 1 Starts Here (Node 1) ------------------");
        logger.info("-------------------- Transaction #1 Starts Here (Node 1)--------------------");

        console.log("SQL: " + query2 );
        console.log("movie_id: " + movie_id_t1 );
        console.log("movie_year: " + movie_year_t1 + "\n");

        // Transaction Start (NODE 1)

        if(node1check == '1'){
            await node1.beginTransaction();
            logger.info("Beginning transaction");

            try{
                // SQL Statement 1
                const data = await node1.execute(query2, {x: movie_id_t1, y: movie_year_t1}, (err,rows) => {
                });

                const data2 = await node1.execute(query1, {x:movie_id_t1}, (err,rows) => {
                });

                if(node1check == node2check){
                    const data3 = await node2.execute(query1, {x:movie_id_t1}, (err,rows) => {
                    });


                    if(data2[0] != data3[0]) {
                        await node2.execute(query2, {x: movie_id_t1, y: movie_year_t1}, (err,rows) => {
                        });
                        logger.info("Node 1 not equal to Node 2, replicating data.");
                    }
                }

                if(node2check != '1')
                {
                    logger.info("Node 2 is offline, Transaction cannot be committed.");
                    throw `Node 2 is offline, Transaction cannot be committed.`;
                }
              
                
                console.log(data[0].info);

               
                // Commit to confirm Transaction
                await node1.commit();
                console.log("Transaction Complete");
                logger.info("Transaction Complete");

            }catch (err) {
                // Roll back Portion
                console.error(`Error Occured : ${err.message}`, err);
                logger.info(`Error Occured: ${err.message}`, err);
                node1.rollback();
                console.info('Rollback successful');
                logger.info('Rollback successful');
                return `Error selecting data`;
            }

        }else if(node2check == '1'){
            await node2.beginTransaction();

            try{
                // SQL Statement 1
                const data = await node2.execute(query2, {x: movie_id_t1, y: movie_year_t1}, (err,rows) => {
                });

                const data2 = await node2.execute(query1, {x:movie_id_t1}, (err,rows) => {
                });

                if(node2check == node1check){
                    const data3 = await node1.execute(query1, {x:movie_id_t1}, (err,rows) => {
                    });

                    if(data2[0] != data3[0]) {
                        await node1.execute(query2, {x: movie_id_t1, y: movie_year_t1}, (err,rows) => {
                        });

                        logger.info("Node 1 not equal to Node 2, replicating data.");

                    }
                }

                if(node1check != '1')
                {
                    logger.info("Node 2 is offline, Transaction cannot be committed.");
                    throw `Node 1 is offline, Transaction cannot be committed.`;
                }
              
                
                console.log(data[0].info);

            
                // Commit to confirm Transaction
                await node2.commit();
                console.log("Transaction Complete");
                logger.info("Transaction Complete");

            }catch (err) {
                // Roll back Portion
                console.error(`Error Occured : ${err.message}`, err);
                logger.info(`Error Occured: ${err.message}`, err);
                node1.rollback();
                console.info('Rollback successful');
                logger.info('Rollback successful');
                return `Error selecting data`;
            }
        }

        console.log("");
        //console.log(req.body.select);

        console.log("--------------------------------------------------------------------------\n");

        node1.end();
        node2.end();
        node3.end(); 
        res.redirect('/')
    },

    getCaseFiveResult: async function(req, res){
        const isolevel = req.body.isolevel;
        const node1check = req.body.c5checknodeone;
        const node2check = req.body.c5checknodetwo;
        const node3check = req.body.c5checknodethree;

        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        logger.info(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds +  " RUNNING TEST CASE");
        
        console.log("isoLevel = " + isolevel);
        logger.info("isoLevel = " + isolevel);

        // Transaction 1 Values
        const movie_id_t1 = 6;  // (Can be edited)
        const movie_year_t1 = 1975;  // (Can be edited)

        // Transaction 2 Values
        const movie_id_t2 = 6;  // (Can be edited)
        const movie_year_t2 = 1971;  // (Can be edited)

        // Queries
        const query1 = "SELECT * FROM movies WHERE movie_id= :x"
        const query2 = "UPDATE movies SET movie_year =  :y  WHERE movie_id = :x";
        
        // Connects to node 1
        const node1 = await mysql.createConnection(config.db1);
        const node2 = await mysql.createConnection(config.db2);
        const node3 = await mysql.createConnection(config.db3);


        console.log("------ Node Status ------");

        if(node1check == '1')
        {
            const node1Status = node1.connect(function(err) {
            });
            try {
                if(node1Status != null)
                {
                    console.log('    Node1 is Active.');
                    logger.info('Node Status: Node 1 is Active.');
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
                    logger.info('Node Status: Node 2 is Active.');
                }else console.log('    Node2 is OFFLINE.');
            }catch (error) {
                return error;
            }
        }  
        if(node3check == '1')
        {
            const node3Status = node3.connect(function(err) {
            });
            try {
                if(node3Status != null)
                {
                    console.log('    Node3 is Active.');
                    logger.info('Node Status: Node 3 is Active.');
                }else console.log('    Node3 is OFFLINE.');
            }catch (error) {
                return error;
            }
        }  
        // const node3Status = node3.connect(function(err) {
        // });
        // try {
        //     if(node3Status != null)
        //     {
        //         console.log('    Node3 is Active.');
        //     }else console.log('    Node3 is OFFLINE.');
        // }catch (error) {
        //     return error;
        // }
       
        console.log("-------------------------");

        // makes sql read arrays as '?' https://github.com/sidorares/node-mysql2/blob/master/documentation/Extras.md
        node1.config.namedPlaceholders = true;
        node2.config.namedPlaceholders = true;
        node3.config.namedPlaceholders = true;

        
        // Set Transaction Level (MUST BE FROM DROP DOWN)
        console.log("\n------------  Isolation Level ------------");

        if(isolevel == '1')
        {
            await node1.execute("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED");
            console.log("             'READ UNCOMMITTED'");
            logger.info("Isolation Level: READ UNCOMMITTED");

        }

        if(isolevel == '2')
        {
            await node1.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
            console.log("             'READ COMMITTED'");
            logger.info("Isolation Level: READ COMMITTED");

        }

        if(isolevel == '3')
        {
            await node1.execute("SET TRANSACTION ISOLATION LEVEL READ REPEATABLE");
            console.log("             'READ REPEATABLE'");
            logger.info("Isolation Level: READ REPEATABLE");

        }

        if(isolevel == '4')
        {
            await node1.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");
            console.log("             'SERIALIZABLE'");
            logger.info("Isolation Level: SERIALIZABLE");

        }
        
        console.log("------------------------------------------");

        console.log("\n-------------------- Transaction 1 Starts Here (Node 1) ------------------");
        logger.info("-------------------- Transaction #1 Starts Here (Node 1)--------------------");

        console.log("SQL: " + query2 );
        console.log("movie_id: " + movie_id_t1 );
        console.log("movie_year: " + movie_year_t1 + "\n");

        // Transaction Start (NODE 1)

        if(node1check == '1'){
            await node1.beginTransaction();

            try{
                // SQL Statement 1
                const data = await node1.execute(query2, {x: movie_id_t1, y: movie_year_t1}, (err,rows) => {
                });

                const data2 = await node1.execute(query1, {x:movie_id_t1}, (err,rows) => {
                });

                // copy node 2 to central node
                if(node1check == node2check){
                    const data3 = await node2.execute(query1, {x:movie_id_t1}, (err,rows) => {
                    });

                    if(data2[0] != data3[0]) {
                        await node2.execute(query2, {x: movie_id_t1, y: movie_year_t1}, (err,rows) => {
                        });

                        logger.info("Node 2 not equal to Node 1, replicating data.");

                    }

                    
                }

                if(node2check != '1')
                {
                    throw `Node 2 is offline, Transaction cannot be committed.`;
                }

                // copy node 3 to central node
                if(node1check == node3check){
                    const data3 = await node3.execute(query1, {x:movie_id_t1}, (err,rows) => {
                    });

                    if(data2[0] != data3[0]) {
                        await node3.execute(query2, {x: movie_id_t1, y: movie_year_t1}, (err,rows) => {
                        });

                        logger.info("Node 3 not equal to Node 1, replicating data.");

                    }

                }

                if(node3check != '1')
                {
                    logger.info("Node 2 is offline, Transaction cannot be committed.");
                    throw `Node 3 is offline, Transaction cannot be committed.`;
                }
              
                
                console.log(data[0].info);

               
                // Commit to confirm Transaction
                await node1.commit();
                console.log("Transaction Complete");
                logger.info("Transaction Complete");

            }catch (err) {
                // Roll back Portion
                console.error(`Error Occured : ${err.message}`, err);
                logger.info(`Error Occured: ${err.message}`, err);
                node1.rollback();
                console.info('Rollback successful');
                logger.info('Rollback successful');
                return `Error selecting data`;
            }

        }


        console.log("");
        //console.log(req.body.select);
        logger.info('Node connections terminated.');


        console.log("--------------------------------------------------------------------------\n");

        node1.end();
        node2.end();
        node3.end(); 
        res.redirect('/')
    },

    getCaseSixResult: async function(req, res){
        const isolevel = req.body.isolevel;
        const node1check = req.body.c6checknodeone;
        const node2check = req.body.c6checknodetwo;
        const node3check = req.body.c6checknodethree;

        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        logger.info(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds +  " RUNNING TEST CASE");
        
        var node1error = node1check;
        
        console.log("isoLevel = " + isolevel);
        logger.info("isoLevel = " + isolevel);

        // Transaction 1 Values
        const movie_id_t1 = 6;  // (Can be edited)
        const movie_year_t1 = 1975;  // (Can be edited)

        // Transaction 2 Values
        const movie_id_t2 = 6;  // (Can be edited)
        const movie_year_t2 = 1971;  // (Can be edited)

        // Queries
        const query1 = "SELECT * FROM movies WHERE movie_id= :x"
        const query2 = "UPDATE movies SET movie_year =  :y  WHERE movie_id = :x";
        
        // Connects to node 1
        const node1 = await mysql.createConnection(config.db1);
        const node2 = await mysql.createConnection(config.db2);
        const node3 = await mysql.createConnection(config.db3);


        console.log("------ Node Status ------");

        if(node1check == '1')
        {
            const node1Status = node1.connect(function(err) {
            });
            try {
                if(node1Status != null)
                {
                    console.log('    Node1 is Active.');
                    logger.info('Node Status: Node 1 is Active.');
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
                    logger.info('Node Status: Node 2 is Active.');
                }else console.log('    Node2 is OFFLINE.');
            }catch (error) {
                return error;
            }
        }  
        if(node3check == '1')
        {
            const node3Status = node3.connect(function(err) {
            });
            try {
                if(node3Status != null)
                {
                    console.log('    Node3 is Active.');
                    logger.info('Node Status: Node 3 is Active.');
                }else console.log('    Node3 is OFFLINE.');
            }catch (error) {
                return error;
            }
        }  
       
        console.log("-------------------------");

        // makes sql read arrays as '?' https://github.com/sidorares/node-mysql2/blob/master/documentation/Extras.md
        node1.config.namedPlaceholders = true;
        node2.config.namedPlaceholders = true;
        node3.config.namedPlaceholders = true;

        
        // Set Transaction Level (MUST BE FROM DROP DOWN)
        console.log("\n------------  Isolation Level ------------");

        if(isolevel == '1')
        {
            await node1.execute("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED");
            await node2.execute("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED");
            console.log("             'READ UNCOMMITTED'");
            logger.info("Isolation Level: READ UNCOMMITTED");

        }

        if(isolevel == '2')
        {
            await node1.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
            await node2.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
            console.log("             'READ COMMITTED'");
        }

        if(isolevel == '3')
        {
            await node1.execute("SET TRANSACTION ISOLATION LEVEL READ REPEATABLE");
            await node2.execute("SET TRANSACTION ISOLATION LEVEL READ REPEATABLE");
            console.log("             'READ REPEATABLE'");
            logger.info("Isolation Level: READ REPEATABLE");

        }

        if(isolevel == '4')
        {
            await node1.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");
            await node2.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");
            console.log("             'SERIALIZABLE'");
            logger.info("Isolation Level: SERIALIZABLE");

        }
        
        console.log("------------------------------------------");

        console.log("\n-------------------- Transaction 1 Starts Here (Node 1) ------------------");
        logger.info("-------------------- Transaction #1 Starts Here (Node 1)--------------------");
        console.log("SQL: " + query2 );
        console.log("movie_id: " + movie_id_t1 );
        console.log("movie_year: " + movie_year_t1 + "\n");

        // Transaction Start (NODE 1)
        if(node2check == '1'  && node1check == '1')
        {
            node1error = 0;

            await node2.beginTransaction();
            logger.info("Beginning transaction");

            try{
                // SQL Statement 1
                const data = await node2.execute(query2, {x: movie_id_t1, y: movie_year_t1}, (err,rows) => {
                });

                const data2 = await node2.execute(query1, {x:movie_id_t1}, (err,rows) => {
                });

                if(node2check == node1error){
                    const data3 = await node1.execute(query1, {x:movie_id_t1}, (err,rows) => {
                    });

                    if(data2[0] != data3[0]) {
                        await node1.execute(query2, {x: movie_id_t1, y: movie_year_t1}, (err,rows) => {
                        });
                    }
                }else {
                    console.log("Transaction in progress...");
                    logger.info("Transaction in progress...");

                    await sleep(5000);

                    node1error = node1check;

                    if(node1error != '1')
                    {
                        logger.info("Connection failed!");
                        throw `Transaction Timeout. Changes cannot be committed.`
                    }else {
                        logger.info("Connection restored!");
                        const data3 = await node1.execute(query1, {x:movie_id_t1}, (err,rows) => {
                        });
    
                        if(data2[0] != data3[0]) {
                            await node1.execute(query2, {x: movie_id_t1, y: movie_year_t1}, (err,rows) => {
                            });
                        }
                    }
                }
                         
                console.log(data[0].info);
                // Commit to confirm Transaction
                await node2.commit();
                console.log("Transaction Complete");
                logger.info("Transaction Complete");
                logger.info('Node connections terminated.');
                node1.end();
                node2.end();
                node3.end(); 
            }catch (err) {
                // Roll back Portion
                console.error(`Error Occured : ${err.message}`, err);
                logger.info(`Error Occured: ${err.message}`, err);
                node1.rollback();
                console.info('Rollback successful');
                logger.info('Rollback successful');
                logger.info('Node connections terminated.');
                node1.end();
                node2.end();
                node3.end(); 
                return `Error selecting data`;
            }

        }else if(node3check == '1' && node1check == '1'){
            node1error = 0;

            await node3.beginTransaction();
            logger.info("Beginning transaction");

            try{
                // SQL Statement 1
                const data = await node3.execute(query2, {x: movie_id_t1, y: movie_year_t1}, (err,rows) => {
                });

                const data2 = await node3.execute(query1, {x:movie_id_t1}, (err,rows) => {
                });

                if(node3check == node1error){
                    const data3 = await node1.execute(query1, {x:movie_id_t1}, (err,rows) => {
                    });

                    if(data2[0] != data3[0]) {
                        await node1.execute(query2, {x: movie_id_t1, y: movie_year_t1}, (err,rows) => {
                        });
                    }
                }else {
                    console.log("Transaction in progress...");
                    logger.info("Transaction in progress...");

                    await sleep(5000);

                    node1error = node1check;

                    if(node1error != '1')
                    {
                        logger.info("Connection failed!");
                        throw `Transaction Timeout. Changes cannot be committed.`
                    }else {
                        logger.info("Connection restored!");
                        const data3 = await node1.execute(query1, {x:movie_id_t1}, (err,rows) => {
                        });
    
                        if(data2[0] != data3[0]) {
                            await node1.execute(query2, {x: movie_id_t1, y: movie_year_t1}, (err,rows) => {
                            });
                        }
                    }
                }
                         
                console.log(data[0].info);
            
                // Commit to confirm Transaction
                await node2.commit();
                console.log("Transaction Complete");
                logger.info("Transaction Complete");
                logger.info('Node connections terminated.');
                node1.end();
                node2.end();
                node3.end(); 
            }catch (err) {
                // Roll back Portion
                console.error(`Error Occured : ${err.message}`, err);
                node1.rollback();
                console.info('Rollback successful');
                logger.info('Rollback successful');
                logger.info('Node connections terminated.');
                node1.end();
                node2.end();
                node3.end(); 
                return `Error selecting data`;
            }
        }

        console.log("");
        //console.log(req.body.select);
        
        console.log("--------------------------------------------------------------------------\n");

        node1.end();
        node2.end();
        node3.end(); 
        res.redirect('/')
    },

    getCaseSevenResult: async function(req,res) {
        const isolevel = req.body.isolevel;
        const node1check = req.body.c7checknodeone;
        const node2check = req.body.c7checknodetwo;
        const node3check = req.body.c7checknodethree;
        
        var node2error = node2check;
        var node3error = node3check;

        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        logger.info(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds +  " RUNNING TEST CASE");
        
        console.log("isoLevel = " + isolevel);
        logger.info("isoLevel = " + isolevel);

        // Transaction 1 Values
        const movie_id_t1 = 6;  // (Can be edited)
        const movie_year_t1 = 1975;  // (Can be edited)

        // Transaction 2 Values
        const movie_id_t2 = 6;  // (Can be edited)
        const movie_year_t2 = 1971;  // (Can be edited)

        // Queries
        const query1 = "SELECT * FROM movies WHERE movie_id= :x"
        const query2 = "UPDATE movies SET movie_year =  :y  WHERE movie_id = :x";
        
        // Connects to node 1
        const node1 = await mysql.createConnection(config.db1);
        const node2 = await mysql.createConnection(config.db2);
        const node3 = await mysql.createConnection(config.db3);


        console.log("------ Node Status ------");

        if(node1check == '1')
        {
            const node1Status = node1.connect(function(err) {
            });
            try {
                if(node1Status != null)
                {
                    console.log('    Node1 is Active.');
                    logger.info('Node Status: Node 1 is Active.');
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
                    logger.info('Node Status: Node 2 is Active.');
                }else console.log('    Node2 is OFFLINE.');
            }catch (error) {
                return error;
            }
        }  
        if(node3check == '1')
        {
            const node3Status = node3.connect(function(err) {
            });
            try {
                if(node3Status != null)
                {
                    console.log('    Node3 is Active.');
                    logger.info('Node Status: Node 3 is Active.');
                }else console.log('    Node3 is OFFLINE.');
            }catch (error) {
                return error;
            }
        }  
       
        console.log("-------------------------");

        // makes sql read arrays as '?' https://github.com/sidorares/node-mysql2/blob/master/documentation/Extras.md
        node1.config.namedPlaceholders = true;
        node2.config.namedPlaceholders = true;
        node3.config.namedPlaceholders = true;

        
        // Set Transaction Level (MUST BE FROM DROP DOWN)
        console.log("\n------------  Isolation Level ------------");

        if(isolevel == '1')
        {
            await node1.execute("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED");
            await node2.execute("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED");
            console.log("             'READ UNCOMMITTED'");
            logger.info("Isolation Level: READ UNCOMMITTED");
        }

        if(isolevel == '2')
        {
            await node1.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
            await node2.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
            console.log("             'READ COMMITTED'");
            console.log("             'READ COMMITTED'");

        }

        if(isolevel == '3')
        {
            await node1.execute("SET TRANSACTION ISOLATION LEVEL READ REPEATABLE");
            await node2.execute("SET TRANSACTION ISOLATION LEVEL READ REPEATABLE");
            console.log("             'READ REPEATABLE'");
            logger.info("Isolation Level: READ REPEATABLE");

        }

        if(isolevel == '4')
        {
            await node1.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");
            await node2.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");
            console.log("             'SERIALIZABLE'");
            logger.info("Isolation Level: SERIALIZABLE");
        }
        
        console.log("------------------------------------------");

        console.log("\n-------------------- Transaction 1 Starts Here (Node 1) ------------------");
        logger.info("-------------------- Transaction #1 Starts Here (Node 1)--------------------");
        console.log("SQL: " + query2 );
        console.log("movie_id: " + movie_id_t1 );
        console.log("movie_year: " + movie_year_t1 + "\n");

        // Transaction Start (NODE 1)
        if(node1check == '1' && node2check =='1')
        {
            node2error = 0;

            await node1.beginTransaction();
            logger.info("Beginning transaction");

            try{
                // SQL Statement 1
                const data = await node1.execute(query2, {x: movie_id_t1, y: movie_year_t1}, (err,rows) => {
                });

                const data2 = await node1.execute(query1, {x:movie_id_t1}, (err,rows) => {
                });

                if(node1check == node2error){
                    const data3 = await node2.execute(query1, {x:movie_id_t1}, (err,rows) => {
                    });

                    if(data2[0] != data3[0]) {
                        await node2.execute(query2, {x: movie_id_t1, y: movie_year_t1}, (err,rows) => {
                        });
                    }
                }else {
                    console.log("Transaction in progress...");
                    logger.info("Transaction in progress...");
                    // console.log(node2error)
                    await sleep(5000);

                    node2error = node2check;
                    // console.log(node2error)
                    if(node2error != '1')
                    {
                        logger.info("Connection failed!");
                        throw `Transaction Timeout. Changes cannot be committed.`
                    }else {
                        logger.info("Connection restored!");
                        const data3 = await node2.execute(query1, {x:movie_id_t1}, (err,rows) => {
                        });
    
                        if(data2[0] != data3[0]) {
                            await node2.execute(query2, {x: movie_id_t1, y: movie_year_t1}, (err,rows) => {
                            });
                        }
                    }
                }
                         
                console.log(data[0].info);
            
                // Commit to confirm Transaction
                await node1.commit();
                console.log("Transaction Complete");
                logger.info("Transaction Complete");
                node1.end();
                node2.end();
                node3.end(); 
            }catch (err) {
                // Roll back Portion
                console.error(`Error Occured : ${err.message}`, err);
                logger.info(`Error Occured: ${err.message}`, err);
                node1.rollback();
                console.info('Rollback successful');
                logger.info('Rollback successful');
                logger.info('Node connections terminated.');
                node1.end();
                node2.end();
                node3.end(); 
                return `Error selecting data`;
            }

        }else if(node1check == '1' && node3check == '1'){
            node3error = 0;

            await node1.beginTransaction();
            logger.info("Beginning transaction");

            try{
                // SQL Statement 1
                const data = await node1.execute(query2, {x: movie_id_t1, y: movie_year_t1}, (err,rows) => {
                });

                const data2 = await node1.execute(query1, {x:movie_id_t1}, (err,rows) => {
                });

                if(node1check == node2error){
                    const data3 = await node3.execute(query1, {x:movie_id_t1}, (err,rows) => {
                    });

                    if(data2[0] != data3[0]) {
                        await node3.execute(query2, {x: movie_id_t1, y: movie_year_t1}, (err,rows) => {
                        });
                    }
                }else {
                    console.log("Transaction in progress...");
                    logger.info("Transaction in progress...");
                    // console.log(node3error);
                    await sleep(5000);

                    node3error = node3check;
                    // console.log(node3error);
                    if(node3error != '1')
                    {
                        logger.info("Connection failed!");
                        throw `Transaction Timeout. Changes cannot be committed.`
                    }else {
                        logger.info("Connection restored!");
                        const data3 = await node3.execute(query1, {x:movie_id_t1}, (err,rows) => {
                        });
    
                        if(data2[0] != data3[0]) {
                            await node3.execute(query2, {x: movie_id_t1, y: movie_year_t1}, (err,rows) => {
                            });
                        }
                    }
                }
                         
                console.log(data[0].info);
            
                // Commit to confirm Transaction
                await node1.commit();
                console.log("Transaction Complete");
                logger.info("Transaction Complete");
                logger.info('Node connections terminated.');
                node1.end();
                node2.end();
                node3.end(); 
            }catch (err) {
                // Roll back Portion
                console.error(`Error Occured : ${err.message}`, err);
                node1.rollback();
                console.info('Rollback successful');
                logger.info('Rollback successful');
                logger.info('Node connections terminated.');
                node1.end();
                node2.end();
                node3.end(); 
                return `Error selecting data`;
            }
        }

        console.log("");
        //console.log(req.body.select);
        
        console.log("--------------------------------------------------------------------------\n");

        node1.end();
        node2.end();
        node3.end(); 
        res.redirect('/index');
    },
    
    versionControl: async function(req, res){
        console.log("Redirect Success");


        
        res.redirect('/index');
    }

}

module.exports = inputController;