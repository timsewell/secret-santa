const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const json = require('./users');
const md5 = require('md5');

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(9000, () => {
    console.log('Listening on %s', 9000);
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

app.get('/users', (req, res) => {
    console.log(json);
    const users = json;

    const now = new Date().getTime().toString();

    const ret = users.users.map(aUser => {
        if (aUser.hash === 'abcdef') {
            aUser.hash = md5(aUser.name + now);
        }
        return aUser;
    });
    res.status(200).send(JSON.stringify(users.users));
});


