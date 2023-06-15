var express = require('express');
var bodyParser = require('body-parser');
const login  = require('./usersData.js');
const countryController = require('./countryController');
const postController = require('./postController.js');

var app = express();

var parser = bodyParser.json();
app.use(parser);

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/startPage.html');
});

app.get('/login', (req, res) => {
    const { username, password } = req.query;

    login(username, password)
    .then((result) => {
        res.send(result);
    })
    .catch((error) => {
        res.status(500).send('An error occurred');
    });
});

app.post('/country', countryController.addCountry);

app.delete('/country', countryController.deleteCountry);

app.post('/submit', postController.addPost);


app.listen(8081);