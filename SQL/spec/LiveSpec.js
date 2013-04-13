
var mysql = require('mysql');
var request = require("request");

describe("Persistent Node Chat Server", function() {
  var dbConnection;

  beforeEach(function() {
    dbConnection = mysql.createConnection({
      user: "root",
      password: "",
      database: "chat"
    });
    dbConnection.connect();

    var tablename = "Messages";
    dbConnection.query("DELETE FROM " + tablename);
  });

  afterEach(function() {
    dbConnection.end();
  });

  it("Should insert posted messages to the DB", function(done) {
    request({method: "POST",
             uri: "http://127.0.0.1:8080/classes/room1",
             form: {username: "Valjean",
                    message: "In mercy's name, three days is all I need."}
            },
            function(error, response, body) {
              var queryString = "SELECT * from Messages";
              var queryArgs = [];

              dbConnection.query( queryString,
                function(err, results, fields) {
                  expect(results.length).toEqual(1);
                  expect(results[0].username).toEqual("Valjean");
                  expect(results[0].message).toEqual("In mercy's name, three days is all I need.");
                  done();
                });
            });
  });

  it("Should output all messages from the DB", function(done) {
    var queryString = "INSERT into Messages (username, message) values ('Javert', 'Men like you can never change!');";
    var queryArgs = [];

    dbConnection.query( queryString,
      function(err, results, fields) {
        request("http://127.0.0.1:8080/classes/room1",
          function(error, response, body) {
            console.log(body)
            var messageLog = JSON.parse(body);
            expect(messageLog[0].username).toEqual("Javert");
            expect(messageLog[0].message).toEqual("Men like you can never change!");
            done();
          });
      });
  });
});
