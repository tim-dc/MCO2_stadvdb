const express = require('express');
const app = express();
const inputController = require('../controllers/inputController');

app.get('/', inputController.getHomePage);
app.post('/caseone', inputController.getCaseOneResult);

app.post('/casetwo', inputController.getCaseTwoResult);
app.post('/casethree', inputController.getCaseThreeResult);
app.post('/casefour', inputController.getCaseFourResult);


app.post('/resetcasetwothree', inputController.resetCaseTwoAndThree)


module.exports = app;
