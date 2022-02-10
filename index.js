const express = require('express');
const hbs = require('hbs');
const routes = require('./routes/routes.js');
const app = express();
const port = 3030;

app.set('view engine', hbs);

app.use(express.urlencoded({extended: true}));
app.use('/', routes);

app.listen(port, function () {
    console.log('listening to port ' + port);
});
