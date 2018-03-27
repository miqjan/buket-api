const http = require('http');
const config = require('./config').default;
if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production') {
    var App = require('./dist/app').default;
} else {
    App = require('./src/app').default;
}
const server = http.createServer(App());
server.listen(config.app.port, function () {
    console.log('api listening at http://%s:%s', server.address().address, server.address().port);
});
