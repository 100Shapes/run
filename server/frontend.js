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
        path: '/admin',
        handler: {
            file: {
                path: 'public/admin.html'
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
};