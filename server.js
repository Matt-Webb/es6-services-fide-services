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
    }, function(error) {
        res.status(404).send(error);
    })
});

// app.post('/api/upload/:fileName', function(req, res) {
//     service.updatePlayerRatings(req.params.fileName).then(function(data) {
//         res.send(data);
//     }, function(error) {
//         res.status(500).send(error);
//     })
// });
//
// app.get('/api/download/:file', function(req, res) {
//     service.startProcess()
//         .then(service.download)
//         .then(service.extract)
//         .then(function(data) {
//             res.send(data);
//         }, function(error){
//             res.status(404).send(error);
//         });
// });

app.listen(port);
