const mysql = require('mysql2');
const config = require('./config/config'); // nodes
const async = require('hbs/lib/async');
const mysql = require('mysql2/promise');

const caseonerun = return(
    async function runcase() {        
        //  Set values to change (UPDATE)
        const movie_id = 6;  // (Can be edited)
        const movie_year = 1975  // (Can be edited)

        // Connects to node 1
        const node1 = await mysql.createConnection(config.db1);

        // makes sql read arrays as '?' https://github.com/sidorares/node-mysql2/blob/master/documentation/Extras.md
        node1.config.namedPlaceholders = true;
        
        // Set Transaction Level 
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
        
    }

    // Call function
    (async function testCase1() {
        console.log(await runcase());
        // process.exit(0);
    })();
    );
}

module.exports = caseonerun;