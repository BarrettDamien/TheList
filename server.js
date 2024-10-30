// Create express app
var express = require("express")
var app = express()
var db = require("./database.js")
var md5 = require("md5")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server port
var HTTP_PORT = 8000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.use(express.static("public"));

app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

// GET endpoints
app.get("/api/users", (req, res, next) => {
    var sql = "select * from user"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.get("/api/user/:user_id", (req, res, next) => {
    var sql = "select * from user where user_id = ?"
    var params = [req.params.user_id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});

app.get("/watchlist", (req, res) => {
    res.sendFile(__dirname + "/public/watchlist.html");
});

app.get("/randomizer", (req, res, next) => {
    res.sendFile(__dirname + "/public/randomizer.html");
});

app.get("/share", (req, res, next) => {
    res.sendFile(__dirname + "/public/share.html");
});

// POST Endpoints
app.post("/api/user/", (req, res, next) => {
    var errors=[]
    if (!req.body.password){
        errors.push("No password specified");
    }
    if (!req.body.email){
        errors.push("No email specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        username: req.body.username,
        email: req.body.email,
        password : md5(req.body.password)
    }
    var sql ='INSERT INTO user (username, email, password) VALUES (?,?,?)'
    var params =[data.username, data.email, data.password]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "user_id" : this.lastID
        })
    });
})

//PATCH Request
app.patch("/api/user/:user_id", (req, res, next) => {
    var data = {
        username: req.body.username,
        email: req.body.email,
        password : req.body.password ? md5(req.body.password) : null
    }
    db.run(
        `UPDATE user set 
           username = COALESCE(?,username), 
           email = COALESCE(?,email), 
           password = COALESCE(?,password) 
           WHERE user_id = ?`,
        [data.username, data.email, data.password, req.params.user_id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
})

//DELETE Request
app.delete("/api/user/:user_id", (req, res, next) => {
    db.run(
        'DELETE FROM user WHERE user_id = ?',
        req.params.user_id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});

