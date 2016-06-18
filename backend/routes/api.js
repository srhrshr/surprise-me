
var db = require('../backend');

exports.login = function(req, res) {
  console.log(req.body.user)
  console.log(req.body.password)
  db.fn_get_user(req.body.user,req.body.password,function(err, results) {
    if(err) { 
        res.send(500,"Server Error"); 
        return;
    }
    // Respond with results as JSON
    res.send(results);
  });
};

exports.register = function(req, res) {
  console.log(req.body.user)
  console.log(req.body.password)
  db.fn_set_user(req.body.user,req.body.password,function(err, results) {
    if(err) { 
        res.send(500,"Server Error"); 
        return;
    }
    // Respond with results as JSON
    res.send(results);
  });
};