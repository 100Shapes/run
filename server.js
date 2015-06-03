var Hapi = require('hapi');

var server = new Hapi.Server({ debug: { 'request': ['error', 'uncaught', 'hapi-less'] }});

server.connection({ port: 8080 });


var backend = require('./server/backend')(server);
var methods = require('./server/methods')(server);
var frontend = require('./server/frontend')(server);
var bluetooth = require('./server/bluetooth')(server);
var Path = require('path');

server.start(function() {
    console.log("Server started", server.info.uri);
});

module.exports = server;