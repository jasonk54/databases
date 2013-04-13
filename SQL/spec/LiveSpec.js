/* You'll need to have MySQL running and your Node server running
 * for these tests to pass. */

var mysql = require('mysql');
var request = require("request"); // You might need to npm install the request module!

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
    // Post a message to the node chat server:
    request({method: "POST",
             uri: "http://127.0.0.1:8080/classes/room1",
             form: {username: "Valjean",
                    message: "In mercy's name, three days is all I need."}
            },
            function(error, response, body) {
              /* Now if we look in the database, we should find the
               * posted message there. */

              var queryString = "SELECT * from Messages";
              var queryArgs = [];
              /* TODO: Change the above queryString & queryArgs to match your schema design
               * The exact query string and query args to use
               * here depend on the schema you design, so I'll leave
               * them up to you. */
              dbConnection.query( queryString,
                function(err, results, fields) {
                  // Should have one result:
                  expect(results.length).toEqual(1);
                  expect(results[0].username).toEqual("Valjean");
                  expect(results[0].message).toEqual("In mercy's name, three days is all I need.");
                  /* TODO: You will need to change these tests if the
                   * column names in your schema are different from
                   * mine! */
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
            var messageLog = JSON.parse(body);
            expect(messageLog[0].username).toEqual("Javert");
            expect(messageLog[0].message).toEqual("Men like you can never change!");
            done();
          });
      });
  });
});
