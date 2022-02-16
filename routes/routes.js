const express = require('express');
const app = express();
const inputController = require('../controllers/inputController');

app.get('/', inputController.createVersion);
app.get('/index', inputController.getHomePage);
app.post('/caseone', inputController.getCaseOneResult);
app.get('/versionControl', inputController.versionControl);

app.post('/casetwo', inputController.getCaseTwoResult);
app.post('/casethree', inputController.getCaseThreeResult);
app.post('/casefour', inputController.getCaseFourResult);
app.post('/casefive', inputController.getCaseFiveResult);
app.post('/casesix', inputController.getCaseSixResult);
app.post('/caseseven', inputController.getCaseSevenResult);

module.exports = app;
