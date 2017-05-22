module.exports = function(server) {
    server.route({
        method: 'GET',
        path: '/',
        handler: {
            file: {
                path: 'public/index.html'
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/togo',
        handler: {
            file: {
                path: 'public/togo.html'
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/admin',
        handler: {
            file: {
                path: 'public/admin/index.html'
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/admin/teams',
        handler: {
            file: {
                path: 'public/admin/teams.html'
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/admin/comps',
        handler: {
            file: {
                path: 'public/admin/comps.html'
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/public/{param*}',
        handler: {
            directory: {
                path: 'public'
            }
        }
    });
    server.register({
        register: require('hapi-less'),
        options: {
            home: __dirname + '/../public/less',
            route: '/public/styles/{filename*}',
            less: {
                compress: true
            }
        }
    }, function (err) {

        if (err) {
            console.log('Failed loading hapi-less');
        }
    });
};
