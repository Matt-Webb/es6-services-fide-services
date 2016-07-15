'use strict';

const config = require('./config/app');
const moment = require('moment');
const FidePlayerService = require('./modules/player.service');
const FirebaseService = require('./modules/firebase.service');
const RatingService = require('./modules/rating.service');
const Players = new FidePlayerService(config);
const FirebaseDb = new FirebaseService(config);
const Rating = new RatingService();

let flags = {
    start: true,
    download: true,
    extract: true,
    add: true
}

function startProcess() {
        return new Promise(function(fulfill, reject) {
            try {
                let fileName = 'fide-players-' + moment().format('DD-MM-YY') + '.zip';
                console.log('created file name with current date / time.');
                fulfill(fileName);
            } catch (err) {
                reject(new Error(err));
            }
        });
}

function download(file) {
    return Players.download(file);
}

function extract(file) {
    return Players.extract(file);
}

function addPlayers() {
    return FirebaseDb.updateAll();
}

function queryPlayer(child, limit) {
    return FirebaseDb.query(child, limit);
}

function playerById(id) {
    return FirebaseDb.playerById(id);
}

function finish(data) {
    console.log(data);
    process.exit();
}

function error(data) {
    console.log(data.Error);
    process.exit();
}

//startProcess()
//    .then(download, error)
//    .then(extract, error)
//    .then(addPlayers, error)
//    .then(finish);

//addPlayers().then(finish, error);

//queryPlayer('rating', 10).then(finish, error);

playerById(418250).then(function(data) {

    let info = Rating.elo(data.rating,1967,data.k_factor,0);

    console.log('Result:');
    console.log(data.name);
    console.log(info.change);

}, error);
