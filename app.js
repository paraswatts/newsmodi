var express = require('express');
var app = express();
var db = require('./db');
var cors = require('cors');

var NewsController = require('./news/NewsController');
app.use(cors());

app.use('/news', NewsController);

module.exports = app;