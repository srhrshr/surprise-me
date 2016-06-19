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
    host: config.MYSQL_HOST,
    user: config.MYSQL_USER,
    password: config.MYSQL_PASSWORD,
    database: config.MYSQL_DATABASE,
    connectionLimit: 10,
    supportBigNumbers: true,
    multipleStatements: true
});
// Get records from a city
exports.callProcedure = function(user_name, callback) {
    var sql = "SELECT * FROM users WHERE user_login_id=? AND user_login_pass = ?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log(err);
            callback(true);
            return;
        }
        // make the query
        connection.query(sql, [user_name], function(err, results) {
            connection.release();
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, results);
        });
    });
};
exports.fn_get_user = function(user, password, callback) {
    var sql = "SELECT * FROM users WHERE user_login_id= ? AND user_login_pass = ?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log(err);
            callback(true);
            return;
        }
        // make the query
        connection.query(sql, [user, password], function(err, results) {
            connection.release();
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, results);
        });
    });
};
exports.pr_set_user = function(user, password, callback) {
    var sql = "insert into users (user_login_id , user_login_pass , user_full_name , user_mobile_number , user_profile_picture ) VALUES (?,?,'',1234567890, NULL)";
    //var sql =  "INSERT INTO users SET user_login_id = ? AND user_login_pass = ?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log(err);
            callback(true);
            return;
        }
        // make the query
        connection.query(sql, [user, password], function(err, results) {
            connection.release();
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, results);
        });
    });
};
exports.fn_get_challenges = function(user_id, callback) {
    /*var sql = "SELECT c.challenge_id , c.challenge_type , c.challenge_difficulty , c.challenge_desc , c.challenge_credits FROM users u, challenges c WHERE c.challenge_difficulty <= u.user_level AND user_login_id = ?";*/
    var sql = "SELECT c.challenge_id , c.challenge_type , c.challenge_difficulty , c.challenge_desc , c.challenge_credits FROM users u, challenges c WHERE c.challenge_difficulty <= u.user_level AND u.user_login_id = ? AND c.challenge_id NOT IN (SELECT challenge_id from skip_activities WHERE user_id = (SELECT user_id from users where user_login_id = ?) ) AND c.challenge_id NOT IN (SELECT challenge_id from activities WHERE user_id = (SELECT user_id from users where user_login_id = ?) );"
        // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log(err);
            callback(true);
            return;
        }
        // make the query
        connection.query(sql, [user_id,user_id,user_id], function(err, results) {
            connection.release();
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, results);
        });
    });
};
exports.fn_skip_challenge = function(user_id, challenge_id, callback) {
    var sql1 = "UPDATE users SET user_credits = user_credits - 5 WHERE user_login_id = ?;"
    var sql2 = "INSERT INTO skip_activities (user_id, challenge_id) SELECT user_id,? FROM users WHERE user_login_id = ?;"
    var sql3 = "SELECT c.challenge_id , c.challenge_type , c.challenge_difficulty , c.challenge_desc , c.challenge_credits FROM users u, challenges c WHERE c.challenge_difficulty <= u.user_level AND u.user_login_id = ? AND c.challenge_id NOT IN (SELECT challenge_id from skip_activities WHERE user_id = (SELECT user_id from users where user_login_id = ?) ) AND c.challenge_id NOT IN (SELECT challenge_id from activities WHERE user_id = (SELECT user_id from users where user_login_id = ?) );"
        // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log(err);
            return;
        }
        // make the query
        connection.query(sql1, [user_id], function(err, results) {
            connection.release();
            if (err) {
                console.log(err);
                return;
            }
        });
    });
    console.log(user_id)
    console.log(challenge_id)
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log(err);
            return;
        }
        // make the query
        connection.query(sql2, [challenge_id, user_id], function(err, results) {
            connection.release();
            if (err) {
                console.log(err);
                return;
            }
        });
    });
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log(err);
            return;
        }
        // make the query
        connection.query(sql3, [user_id,user_id, user_id], function(err, results) {
            connection.release();
            if (err) {
                console.log(err);
                return;
            }
            callback(false, results);
        });
    });
};
exports.fn_complete_challenge = function(user_id, challenge_id, photo_path, callback) {
    var sql1 = "UPDATE users SET user_credits = user_credits + (SELECT challenge_credits FROM challenges WHERE challenge_id = ?) WHERE user_login_id = ?;"
    var sql2 = "INSERT INTO activities (user_id, challenge_id, activity_picture) SELECT user_id,?,? FROM users WHERE user_login_id = ?;"
    var sql3 = "SELECT c.challenge_id , c.challenge_type , c.challenge_difficulty , c.challenge_desc , c.challenge_credits FROM users u, challenges c WHERE c.challenge_difficulty <= u.user_level AND u.user_login_id = ? AND c.challenge_id NOT IN (SELECT challenge_id from skip_activities WHERE user_id = (SELECT user_id from users where user_login_id = ?) ) AND c.challenge_id NOT IN (SELECT challenge_id from activities WHERE user_id = (SELECT user_id from users where user_login_id = ?) );"
        // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log(err);
            return;
        }
        // make the query
        connection.query(sql1, [challenge_id, user_id], function(err, results) {
            connection.release();
            if (err) {
                console.log(err);
                return;
            }
        });
    });
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log(err);
            return;
        }
        // make the query
        connection.query(sql2, [challenge_id, photo_path,user_id], function(err, results) {
            connection.release();
            if (err) {
                console.log(err);
                return;
            }
        });
    });
    pool.getConnection(function(err, connection) {
            if (err) {
                console.log(err);
                return;
            }
            // make the query
            connection.query(sql3, [user_id,user_id, user_id], function(err, results) {
                connection.release();
                if (err) {
                    console.log(err);
                    callback(true);
                    return;
                }
                callback(false, results);
            });
        });
};
exports.fn_get_wall  = function(callback) {
    var sql = "SELECT u.user_login_id as user, c.challenge_desc as challenge, a.activity_picture as photo FROM activities a, challenges c, users u WHERE a.challenge_id = c.challenge_id AND u.user_id = a.user_id";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log(err);
            callback(true);
            return;
        }
        // make the query
        connection.query(sql, function(err, results) {
            connection.release();
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, results);
        });
    });
};

var app = express();
app.use(morgan('dev'));
/*app.use(bodyParser.urlencoded({
    extended: true
}));*/
app.use(express.static('public'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(methodOverride());
app.post('/api/login', api.login);
app.post('/api/register', api.register);
app.post('/api/showSurprise', api.showSurprise);
app.post('/api/skipSurprise', api.skipSurprise);
app.post('/api/completeSurprise', api.completeSurprise);
app.post('/api/wall', api.wall);
// Start server
app.listen(8000, function() {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
