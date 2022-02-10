const inputController = {

    getHomePage: function(req, res){
        res.render('main');
    },

    getIsolationLevel: function(req, res){
        //const isolevel = req.body.isolevel;
        //console.log("hatdog");
        console.log(req.body.select);
    }
}

module.exports = inputController;