'use strict';

const config = require('./config/app');
const moment = require('moment');
const log = require( './modules/logger.service' );
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

    function download( file ) {
        return Players.download( file );
    }

    function extract(file) {
        return Players.extract( file );
    }

    function addPlayers(fileName) {
        return FirebaseDb.createAll( fileName );
    }

    function updatePlayerRatings( fileName ) {
        return FirebaseDb.updateRatings( fileName )
    }

    function queryPlayer( child, limit ) {
        return FirebaseDb.query( child, limit );
    }

    function playerById( id ) {
        return FirebaseDb.playerById( id );
    }

    function finish(data) {
        log.trace( 'Process Finished', data );
        process.exit();
    }

    function error(data) {
        log.error( 'Process Error', data.Error );
        process.exit();
    }

    return {
        startProcess        : startProcess,
        download            : download,
        extract             : extract,
        addPlayers          : addPlayers,
        updatePlayerRatings : updatePlayerRatings,
        queryPlayer         : queryPlayer,
        playerById          : playerById
    };
}
