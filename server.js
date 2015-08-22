#!/bin/env node

// Modules
var express = require('express');
var needle = require('needle');
var _ = require('lodash');
var app = express();
var WebSocketClient = require('websocket').client;

// Secrets
var secrets = require('./secrets.json');

// Services
var messages = require('./services/messages');


// Start RTM session
needle.get("https://slack.com/api/rtm.start?token="+secrets.token, function(err, response){
    if(!response.body.ok) { return console.error('Some kinda error', response.body.errors); }
    var team = response.body;

    // Find channel for proof of concept

    // Find user
    var user = _.find(team.users, function(thisUser){
        return thisUser.name === 'jorisdekoelste'; // 'niels';
    });

    // Find IM channel
    var userChannel = _.find(team.ims, function(ch){
        return ch.user === user.id;
    });

    // Set up websocket client
    var client = new WebSocketClient();

    client.on('connectFailed', function(error) {
        console.log('Connect Error: ' + error.toString());
    });

    client.on('connect', function(connection) {
        console.log('WebSocket Client Connected');
        connection.on('error', function(error) {
            console.log("Connection Error: " + error.toString());
        });
        connection.on('close', function() {
            console.log('echo-protocol Connection Closed');
        });
        messages.init(connection, team, function(){
            messages.send({
                "type": "message",
                "channel": userChannel.id,
                "text": "Hello world!"
            });
        });
    });

    // Try to connect
    client.connect(response.body.url);
});

