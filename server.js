var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: 8080 });

var backend = require('./routes/backend')(server);
var database = require('./routes/database')(server);
var frontend = require('./routes/frontend')(server);
var bluetooth = require('./bluetooth')(server);
var Path = require('path');

server.start(function() {
    console.log("Server started", server.info.uri);
});

module.exports = server;