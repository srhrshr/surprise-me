
var db = require('../backend');

exports.login = function(req, res) {
  console.log(req.body.title)
  db.getRecords(req.body.title, function(err, results) {
    if(err) { 
        res.send(500,"Server Error"); 
        return;
    }
    // Respond with results as JSON
    res.send(results);
  });
};