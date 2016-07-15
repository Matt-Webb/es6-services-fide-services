'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
const service = require('./main')();

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.get('/api/player/:id', function(req, res) {
    service.playerById(req.params.id).then(function(data) {
        res.send(data);
    })
});

app.listen(port);
