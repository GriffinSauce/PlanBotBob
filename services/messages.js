/*
 *  Service that handles all messaging for the app
 *  Sends messages, autoresponds to keywords and triggers other methods/services on keywords
 *
 */

// Modules
var needle = require('needle');
var _ = require('lodash');
var WebSocketClient = require('websocket').client;
var moment = require('moment');

// Secrets
var secrets = require('../secrets.json');

// Vars
var connection;
var messageIndex = 0;
var connectionLive = false;
var callback;

// Initialise message service and bind listeners
module.exports.init = function(cb) {
    callback = cb;

    // Start RTM session
    needle.get("https://slack.com/api/rtm.start?token="+secrets.token, function(err, response){
        if(!response.body.ok) { return console.error('Some kinda error', response.body.errors); }
        var team = response.body;

        // Set up websocket client
        var client = new WebSocketClient();

        client.on('connectFailed', function(error) {
            connectionLive = false;
            console.log('Connect Error: ' + error.toString());
        });

        client.on('connect', function(conn) {
            connection = conn;
            connectionLive = true;
            conn.on('error', function(error) {
                connectionLive = false;
                console.log("Connection Error: " + error.toString());
            });
            conn.on('close', function() {
                connectionLive = false;
                console.log('echo-protocol Connection Closed');
            });
            conn.on('message', handleMessage);
        });

        // Try to connect
        client.connect(response.body.url);
    });
};

// Send a message, takes standard Slack message data
module.exports.send = send;

function send(data) {
    if(!connection || !connectionLive) { return console.log('No connection, message not sent', data); }
    data.id = ++messageIndex;
    console.log('Sending message',data);
    connection.sendUTF(JSON.stringify(data));
}

// Handle incoming messages
// TODO: Split messages and other events
function handleMessage(message) {
    message = JSON.parse(message.utf8Data);
    console.log("Received:", message);

    // Here we should define which messages trigger which response

    // Slack says hello on connection start, run callback
    if(message.type === 'hello') {
        console.log('Initialized message service');
        connectionLive = true;
        callback();
        callback = null;
        return;
    }

    // Reply to any message containing "reply"
    if(message.type === 'message' && message.text.indexOf('reply') !== -1) {
        send({
            "type": "message",
            "channel": message.channel,
            "text": "Sure, hi!"
        });
    }

		if(message.type === 'message' && message.text.match('evening|afternoon|morning|allday') !== null) {
		var part = message.text.match('evening|afternoon|morning');
		var available = message.text.match('true|false')[0] === 'true' ? true : false;

			send(
				{
					"type": "message",
					"channel": message.channel,
					"text": "Planning"
				}
			);
			var avl = require('./availability.js');
			console.log(message);
			avl.setAvailability(message.user, moment().format("YYYY-MM-DD"), part[0], available);
		}
}
