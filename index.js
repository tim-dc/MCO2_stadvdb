const express = require('express');
const hbs = require('hbs');
const routes = require('./routes/routes.js');

const app = express();
const port = 3030;

app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.use('/', routes);

app.listen(port, function () {
    console.log('listening to port ' + port);
});

// const mysql = require('mysql2');
const config = require('./config/config'); // nodes
const async = require('hbs/lib/async');
const mysql = require('mysql2/promise');

async function case1() {        
 

    const movie_id = 6;
    const movie_year = 1975
    const node1 = await mysql.createConnection(config.db1);

    node1.config.namedPlaceholders = true;
    

    await node1.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
    console.log("Isolation level is now 'READ COMMITTED'");

    await node1.beginTransaction();

    try{
        await node1.execute( "SELECT * FROM movies WHERE movie_id= :x", {x: movie_id}, (err,rows) => {
        });

        console.log("Selected movie_id = 6")
        
        await node1.execute("UPDATE movies SET movie_year = :x WHERE movie_id = :y", {x: movie_year, y:movie_id},  (err,rows) => {
        });

        console.log("Updated year to 1975");

        await node1.commit();

    }catch (err) {
        console.error(`Error Occured trying to fetch Case 1: ${err.message}`, err);
        node1.rollback();
        console.info('Rollback successful');
        return `Error selecting data`;

    }
    
}

(async function testCase1() {
    console.log(await case1());
    process.exit(0);
  })();


/*
// NODE 1 CONNECTION
node1.connect(function(err) {
    if (err) {
    return console.error('error: ' + err.message);
    }

    // NODE 2 CONNECTION
    console.log('Node2 is Active.');
});

// Query
node1.execute("SELECT * FROM movies WHERE movie_id=?",[6],(err,result)=>{
    console.log(result);
});
*/