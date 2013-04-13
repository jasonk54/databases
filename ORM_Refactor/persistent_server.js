var mysql = require('mysql');
var http = require("http");
var url = require('url');
var querystring = require('querystring');
var data = '';
var Sequelize = require("sequelize");
var sequelize = new Sequelize("chat", "root");

var handleRequest = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);
  if ((url.parse(request.url).pathname).match(/\/classes\//)) {
    var statusCode = 200;
  } else {
    var statusCode = 404;
  }
  var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
  };
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";

  request.on('data', function(chunk) {
      data += chunk;
  });

  request.on('end', function() {
    if(request.method === 'POST') {
      statusCode = 302;
      response.writeHead(statusCode, headers);
      var chunk = querystring.parse(data);
      addData(chunk);
      return response.end('\n');
    } 
    if (request.method === 'GET') {
      response.writeHead(statusCode, headers);
      return dbConnection.query("SELECT * FROM Messages", function(err, results) {
        if (err) { return console.log(err); }
        response.end(JSON.stringify(results));
      });
    }
  });
};

var addData = function(chunk) {
  var querystr = 'insert into Messages (username, message, roomname) values("' + chunk.username + '", "' + chunk.message + '", "' + chunk.roomname + '");';
  dbConnection.query(querystr, function(err, results) {
    if (err) { return console.log(err); }
  });
};

var port = 8080;
var ip = "127.0.0.1";
var server = http.createServer(handleRequest);

console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);

