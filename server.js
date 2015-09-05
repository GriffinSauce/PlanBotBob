#!/bin/env node

// Modules
var express = require('express');
var _ = require('lodash');
var app = express();
var fs = require('fs');

// Initialise config
global.pbb = require('./config.json');

// Set up database connection
var database = require('./database.js');

// Services
var messages = require('./services/messages');

messages.init(function(){
    // callback, messages is (probably) online!
});

app.use(express.static('public'));

app.get('/hello', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(3000, function () {
    console.log('Server listening');
    return fs.writeFileSync('.rebooted', 'rebooted'); // Let gulp know
});
