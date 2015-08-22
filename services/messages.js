/*
 *  Service that handles all messaging for the app
 *  Sends messages, autoresponds to keywords and triggers other methods/services on keywords
 *
 */

// Modules
var _ = require('lodash');

var connection;
var messageIndex = 0;

// Initialise message service
// Binds listeners
module.exports.init = function(conn, team, callback) {
    console.log('Initializing message service');
    connection = conn;
    conn.on('message', handleMessage);
    return callback();
};

// Send a message, takes standard Slack message data
module.exports.send = send;

function send(data) {
    if(!connection) { return console.log('No connection, message not sent', data); }
    data.id = ++messageIndex;
    console.log('Sending message',data);
    connection.sendUTF(JSON.stringify(data));
};

function handleMessage(message) {
    message = JSON.parse(message.utf8Data);
    console.log("Received:", message);

    // Here we should define which messages trigger which response

    // Reply to any message containing "reply"
    if(message.type === 'message' && message.text.indexOf('reply') !== -1) {
        send({
            "type": "message",
            "channel": message.channel,
            "text": "Sure, hi!"
        });
    }
}
