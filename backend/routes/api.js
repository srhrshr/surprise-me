var db = require('../backend');
var decode = require('../decodeBase64Image')
var fs = require('fs')
var path = require('path')
exports.login = function(req, res) {
    console.log(req.body.user)
    console.log(req.body.password)
    db.fn_get_user(req.body.user, req.body.password, function(err, results) {
        if (err) {
            console.log(err)
            res.send({
                "status": 500,
                "message": "Server Error"
            });
            return;
        } else if (results != undefined && results.length > 0) {
            result = results[0]
            var obj = {
                "verified": true,
                "name": result.user_login_id,
                "credits": result.user_credits
            }
            res.status(200).json(obj);
        } else {
            res.status(200).send({
                "message": "User not found!"
            });
            return;
        }
    });
};
exports.register = function(req, res) {
    console.log(req.body.user)
    console.log(req.body.password)
    db.checkUser(req.body.user, function(err, results) {
        if (err) {
            console.log(err)
            res.send({
                "status": 500,
                "message": "Server Error"
            });
            return;
        } else if (results != undefined && results.length > 0) {
            result = results[0]
            var obj = {
                "verified": false,
                "name": result.user_login_id,
                "status": "User already exists or invalid credentials"
            }
            res.status(200).json(obj);
        } else if (results != undefined && results.length == 0) {
            db.pr_set_user(req.body.user, req.body.password, function(err, results) {
                console.log(results)
		if (err) {
                    console.log(err)
                    res.send({
                        "status": 500,
                        "message": "Server Error"
                    });
                    return;
                } else if (results != undefined && results.length > 0) {
                    result = results[0]
                    var obj = {
                        "verified": true,
                        "name": result.user_login_id,
                        "credits": result.user_credits
                    }
                    res.status(200).json(obj);
                } else {
                    res.status(200).send({
                        "message": "User not found!"
                    });
                    return;
                }
            });
        } else {
            res.status(200).send({
                "message": "User not found!"
            });
            return;
        }
    });
};
exports.showSurprise = function(req, res) {
    console.log(req.body.user)
    db.fn_get_challenges(req.body.user, function(err, results) {
        if (err) {
            console.log(err)
            res.send({
                "status": 500,
                "message": "Server Error"
            });
            return;
        } else if (results != undefined && results.length > 0) {
            result = results[Math.ceil(Math.random() * results.length - 1)]
            var obj = {
                "id": result.challenge_id,
                "challenge": result.challenge_desc,
                "skip_credits": 5,
                "credits": result.challenge_credits
            }
            res.status(200).json(obj);
        } else {
            res.status(200).send({
                "message": "No challenges found!"
            });
            return;
        }
    });
}
exports.skipSurprise = function(req, res) {
    console.log(req.body.id)
    console.log(req.body.user)
    db.fn_skip_challenge(req.body.user, req.body.id, function(err, results) {
        if (err) {
            console.log(err)
            res.send({
                "status": 500,
                "message": "Server Error"
            });
            return;
        } else if (results != undefined && results.length > 0) {
            result = results[Math.ceil(Math.random() * results.length - 1)]
            var obj = {
                "id": result.challenge_id,
                "challenge": result.challenge_desc,
                "skip_credits": 5,
                "credits": result.challenge_credits
            }
            res.status(200).json(obj);
        } else {
            res.status(200).send({
                "message": "No challenges found!"
            });
            return;
        }
    });
}
exports.completeSurprise = function(req, res) {
    console.log(req.body.id)
    console.log(req.body.user)
    var imageBuffer = decode.decodeBase64Image(req.body.photo)
    var photo_name = req.body.id + '_' + req.body.user + '.jpg'
    var photo_path = '/images/' + photo_name
    fs.writeFile(__dirname + '/../public/images/' + photo_name, imageBuffer.data, function(err) {
        if (err) console.log(err)
        console.log('/images/' + photo_name)
    });
    /*    var img = new Buffer(req.body.photo, 'base64');

       res.writeHead(200, {
         'Content-Type': 'image/png',
         'Content-Length': img.length
       });
       res.end(img);
    */
    db.fn_complete_challenge(req.body.user, req.body.id, photo_path, function(err, results) {
        if (err) {
            console.log(err)
            res.send({
                "status": 500,
                "message": "Server Error"
            });
            return;
        } else if (results != undefined && results.length > 0) {
            result = results[Math.ceil(Math.random() * results.length - 1)]
            var obj = {
                "id": result.challenge_id,
                "challenge": result.challenge_desc,
                "skip_credits": 5,
                "credits": result.challenge_credits
            }
            res.status(200).json(obj);
        } else {
            res.status(200).send({
                "message": "No challenges found!"
            });
            return;
        }
    });
}
exports.wall = function(req, res) {
    db.fn_get_wall(function(err, results) {
        if (err) {
            console.log(err)
            res.send({
                "status": 500,
                "message": "Server Error"
            });
            return;
        } else if (results != undefined && results.length > 0) {
            res.status(200).send(results)
                /*result = results[Math.ceil(Math.random()*results.length - 1)]
                var obj = {
                    "id":result.challenge_id,
                    "challenge": result.challenge_desc,
                    "skip_credits":5,
                    "credits": result.challenge_credits
                }
                res.status(200).json(obj);*/
        } else {
            res.status(200).send({
                "message": "Wall not found!"
            });
            return;
        }
    });
}
