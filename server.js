#!/bin/env node

var secrets = require('./secrets.json');
var express = require('express');
var needle = require('needle');
var _ = require('lodash');
var app = express();
var WebSocketClient = require('websocket').client;

// Start RTM session and get connection url
needle.get("https://slack.com/api/rtm.start?token="+secrets.token, function(err, response){
    if(!response.body.ok) { return console.error('Some kinda error', response.body.errors); }

    // Find channel for proof of concept

    // Find user
    var user = _.find(response.body.users, function(thisUser){
        return thisUser.name === 'jorisdekoelste'; // 'niels';
    });

    // Find IM channel
    var userChannel = _.find(response.body.ims, function(ch){
        return ch.user === user.id;
    });


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
        connection.on('message', function(message) {
            console.log("Received:", message);
        });
        connection.sendUTF(JSON.stringify({
            "id": 1,
            "type": "message",
            "channel": userChannel.id,
            "text": "Hello world!"
        }));
    });

    // Try to connect
    client.connect(response.body.url);
});

