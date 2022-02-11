const mysql = require('mysql2');
const mysqlpromise = require('mysql2/promise');
const config = require('../config/config'); // nodes

const node1 = mysql.createConnection(config.db1);


node1.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
  
    // NODE 2 CONNECTION
    console.log('Node2 is Active.');
});


// Query

const inputController = {

    getHomePage: function(req, res){
        res.render('main');
    },

    getIsolationLevel: function(req, res){
        const isolevel = req.body.isolevel;
        node1.execute("SELECT * FROM movies WHERE movie_id=?",[6],(err,result)=>{
            console.log(result);
        });
        //console.log(req.body.select);
        //res.redirect('/')
    }
}

module.exports = inputController;