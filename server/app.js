var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');

var port = process.env.PORT || 8080;
// Local database name
var DB_NAME = '/wishlist';
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432' + DB_NAME;

var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// Base URL
app.get('/', function(req, res) {
    res.sendFile(path.resolve('views/index.html'));
});

app.get('/getItems', function(req, res) {
    console.log('getting items');
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            client.query('SELECT * FROM items ORDER BY complete, claimed', function(err, result) {
                if (err) {
                    console.log(err);
                    res.sendStatus(400);
                } else {
                    res.send(result.rows);
                    done();
                }
            });
        }
    });
});

app.post('/addItem', function(req, res) {
    console.log('adding item:', req.body);
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            client.query('INSERT INTO items (name) VALUES ($1)', [req.body.name], function(err, result) {
                if (err) {
                    console.log(err);
                    res.sendStatus(400);
                    done();
                } else {
                    res.sendStatus(200);
                    done();
                }
            });
        }
    });
});

app.put('/updateItem', function(req, res) {
    console.log('updating an item:', req.body);
    // Only allow requests that want to change the [claimed] or [complete] columns
    if (req.body.changeType == 'claimed' || req.body.changeType == 'complete') {
        pg.connect(connectionString, function(err, client, done) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                client.query('UPDATE items SET ' + req.body.changeType + '=$1 WHERE id=$2', [req.body.changeValue, req.body.id], function(err, result) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(400);
                        done();
                    } else {
                        res.sendStatus(200);
                        done();
                    }
                });
            }
        });
    } else {
        res.sendStatus(400);
    }
});

app.delete('/deleteItem', function(req, res) {
    console.log('deleting an item:', req.body);
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            client.query('DELETE FROM items WHERE id=$1', [req.body.id], function(err, result) {
                if (err) {
                    console.log(err);
                    res.sendStatus(400);
                    done();
                } else {
                    res.sendStatus(200);
                    done();
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
