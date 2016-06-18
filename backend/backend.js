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
  database : config.MYSQL_DATABASE,
  connectionLimit: 10,
  supportBigNumbers: true
});

// Get records from a city
exports.callProcedure = function(user_name, callback) {
  var sql = "SELECT * FROM users WHERE user_login_id=? AND user_login_pass = ?";
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

exports.fn_get_user = function(user , password,callback ){
  var sql =  "SELECT * FROM users WHERE user_login_id= ? AND user_login_pass = ?";
  // get a connection from the pool
  pool.getConnection(function(err, connection) {
    if(err) { console.log(err); callback(true); return; }
    // make the query
    connection.query(sql, [user,password], function(err, results) {
      connection.release();
      if(err) { console.log(err); callback(true); return; }
      callback(false, results);
    });
  });
};


exports.pr_set_user = function(user,password,callback ){
  var sql = "insert into users (user_login_id , user_login_pass , user_full_name , user_mobile_number , user_profile_picture ) VALUES (?,?,'',1234567890, NULL)";
  //var sql =  "INSERT INTO users SET user_login_id = ? AND user_login_pass = ?";
  // get a connection from the pool
  pool.getConnection(function(err, connection) {
    if(err) { console.log(err); callback(true); return; }
    // make the query
    connection.query(sql, [user,password], function(err, results) {
      connection.release();
      if(err) { console.log(err); callback(true); return; }
      callback(false, results);
    });
  });
};


exports.fn_get_challenges = function(user_id ,callback ){
  var sql = "SELECT c.challenge_id , c.challenge_type , c.challenge_difficulty , c.challenge_desc , c.challenge_credits FROM users u, challenges c WHERE c.challenge_difficulty <= u.user_level AND u.user_login_id = ? ";
  // get a connection from the pool
  pool.getConnection(function(err, connection) {
    if(err) { console.log(err); callback(true); return; }
    // make the query
    connection.query(sql, [user_id], function(err, results) {
      connection.release();
      if(err) { console.log(err); callback(true); return; }
      callback(false, results);
    });
  });
};


/*exports.fn_get_user = function(user_id , password,callback ){
  var sql = "CALL fn_get_user ( ? , ? )";
  // get a connection from the pool
  pool.getConnection(function(err, connection) {
    if(err) { console.log(err); callback(true); return; }
    // make the query
    connection.query(sql, [user_id,password], function(err, results) {
      connection.release();
      if(err) { console.log(err); callback(true); return; }
      callback(false, results);
    });
  });
};

exports.fn_get_user = function(user_id , password,callback ){
  var sql = "CALL fn_get_user ( ? , ? )";
  // get a connection from the pool
  pool.getConnection(function(err, connection) {
    if(err) { console.log(err); callback(true); return; }
    // make the query
    connection.query(sql, [user_id,password], function(err, results) {
      connection.release();
      if(err) { console.log(err); callback(true); return; }
      callback(false, results);
    });
  });
};*/


var app = express();

app.use(morgan('dev'));
/*app.use(bodyParser.urlencoded({
    extended: true
}));*/
app.use(bodyParser.json());
app.use(methodOverride());

app.post('/api/login', api.login);

app.post('/api/register', api.register);

app.post('/api/showSurprise', api.showSurprise);

/*
app.post('/api/completeSurprise', api.completeSurprise);

app.post('/api/wall', api.wall);*/

// Start server
app.listen(8000, function() {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
