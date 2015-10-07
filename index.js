// Modules   *******************************************************
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var fs = require('fs');
var https = require('https');
var http = require('http');

// Configuration *******************************************************

// Set port
var port = process.env.PORT || 8080;

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
//app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// routes *******************************************************
require('./app/twitter')(app, express); // twitter API
require('./app/routes')(app); // configure routes

// start app *******************************************************
// startup our app at http://localhost:8080
//app.listen(port);

app.get('/', function (req, res) {
    res.send("hello");
});

http.createServer(app).listen(port);

https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}, app).listen(55555);

// shoutout to the user
console.log('Gossip about the tweets near you on port ' + port);

// expose app
exports = module.exports = app;