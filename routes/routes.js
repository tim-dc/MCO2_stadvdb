const express = require('express');
const app = express();
const inputController = require('../controllers/inputController');

app.get('/', inputController.getHomePage);
app.post('/', inputController.getIsolationLevel);

module.exports = app;
