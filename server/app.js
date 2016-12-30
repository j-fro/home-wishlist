var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');

var port = process.env.PORT || 8080;
// Local database name
var DB_NAME = '/wishlist';
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432' + DB_NAME;

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// Base URL
app.get('/', function(req, res) {
    res.sendFile(path.resolve('views/index.html'));
});

// Base POST
app.post('/addItem', function(req, res) {
    console.log('adding item:', req.body);
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            console.log('connected');
            client.query('INSERT INTO items (name) VALUES ($1)', [req.body.name], function(err, result) {
                if(err) {
                    console.log(err);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
});

app.listen(port, function() {
    console.log('server listening on', port);
});

// Expose public folder
app.use(express.static('public'));
