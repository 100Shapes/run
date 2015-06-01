var Hapi = require('hapi');
var backend = require('./backend');
var frontend = require('./frontend');
var bluetooth = require('./bluetooth');
var Path = require('path');

var server = new Hapi.Server();

server.connection({ port: 8080 });

server.views({
    engines: {
        html: require('handlebars')
    },
    path: Path.join(__dirname, 'templates')
});

server.route(backend);
server.route(frontend);

server.start();