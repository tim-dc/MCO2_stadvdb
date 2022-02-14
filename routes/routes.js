const express = require('express');
const app = express();
const inputController = require('../controllers/inputController');

app.get('/', inputController.getHomePage);
app.post('/caseone', inputController.getCaseOneResult);

app.post('/casetwo', inputController.getCaseTwoResult);
app.post('/casethree', inputController.getCaseThreeResult);
app.post('/casefour', inputController.getCaseFourResult);
app.post('/casefive', inputController.getCaseFiveResult);
app.post('/casesix', inputController.getCaseSixResult);
app.post('/caseseven', inputController.getCaseSevenResult);



app.post('/resetcasetwothree', inputController.resetCaseTwoAndThree)


module.exports = app;
