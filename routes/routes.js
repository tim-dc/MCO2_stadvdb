const express = require('express');
const app = express();
const inputController = require('../controllers/inputController');

app.get('/', inputController.getHomePage);
app.post('/caseone', inputController.getCaseOneResult);

app.post('/casetwo', inputController.getCaseTwoResult);
app.post('/casethree', inputController.getCaseTwoResult);


module.exports = app;
