const express = require('express');
const app = express();
const inputController = require('../controllers/inputController');

app.get('/', inputController.getHomePage);
app.post('/', inputController.getIsolationLevel);

app.post('/btntwo', inputController.getButtonTwo);

module.exports = app;
