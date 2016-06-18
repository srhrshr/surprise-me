var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('error-handler'),
    morgan = require('morgan'),
    jwt = require('jwt-simple'),
    path = require('path'),
    api = require('./routes/api'),
    colors = require('colors/safe'),
    config = require('./config');

var mysql = require('mysql');

var pool = mysql.createPool({
  host     : config.MYSQL_HOST,
  user     : config.MYSQL_USER,
  password : config.MYSQL_PASSWORD,
  database : config.DATABASE,
  connectionLimit: 10,
  supportBigNumbers: true
});

// Get records from a city
exports.getRecords = function(user_name, callback) {
  var sql = "SELECT * FROM employee WHERE Title=?";
  // get a connection from the pool
  pool.getConnection(function(err, connection) {
    if(err) { console.log(err); callback(true); return; }
    // make the query
    connection.query(sql, [user_name], function(err, results) {
      connection.release();
      if(err) { console.log(err); callback(true); return; }
      callback(false, results);
    });
  });
};

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());

app.post('/api/login', api.login);
// Start server
app.listen(8000, function() {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});