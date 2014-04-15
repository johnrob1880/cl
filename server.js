var http = require('http'),
    static = require('node-static');

var staticServer = new(static.Server)('./public');

http.createServer(function (req, res) {
    req.addListener('end', function () {
        staticServer.serve(req, res);
    });
}).listen(8080);
