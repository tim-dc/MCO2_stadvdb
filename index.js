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

const mysql = require('mysql2');
const mysqlpromise = require('mysql2/promise');
const config = require('./config/config'); // nodes

const node1 = mysql.createConnection(config.db1);
// const node2 = mysql.createConnection(config.db2);
//const node3 = mysql.createConnection(config.db3);

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

