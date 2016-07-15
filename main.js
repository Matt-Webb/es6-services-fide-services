'use strict';

const config = require('./config/app');
const moment = require('moment');
const FidePlayerService = require('./modules/player.service');
const FirebaseService = require('./modules/firebase.service');
const RatingService = require('./modules/rating.service');
const Players = new FidePlayerService(config);
const FirebaseDb = new FirebaseService(config);
const Rating = new RatingService();


module.exports = function() {

    function startProcess() {
        return new Promise(function(fulfill, reject) {
            const fileName = 'fide-players-' + moment().format('DD-MM-YY') + '.zip';
            fulfill(fileName);
        });
    }

    function download(file) {
        return Players.download(file);
    }

    function extract(file) {
        return Players.extract(file);
    }

    function addPlayers(fileName) {
        return FirebaseDb.createAll(fileName);
    }

    function updatePlayerRatings(fileName) {
        console.log('Update initiated!');
        return FirebaseDb.updateRatings(fileName)
    }

    function queryPlayer(child, limit) {
        return FirebaseDb.query(child, limit);
    }

    const playerById = function(id) {
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

    return {
        startProcess: startProcess,
        download: download,
        extract: extract,
        addPlayers: addPlayers,
        updatePlayerRatings: updatePlayerRatings,
        queryPlayer: queryPlayer,
        playerById: playerById
    };
}




// startProcess()
//     .then(addPlayers, error)
//     .then(updatePlayerRatings, error)
//     .then(updatePlayerRatings, error)
//     .then(finish, error);
