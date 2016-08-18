"use strict";

const config = require( './config/app' );
const moment = require( 'moment' );
const log = require( './modules/logger.service' );
const FidePlayerService = require( './modules/player.service' );
const FirebaseService = require( './modules/firebase.service' );
const RatingService = require( './modules/rating.service' );
const Players = new FidePlayerService( config );
const FirebaseDb = new FirebaseService( config );
const Rating = new RatingService();


module.exports = function() {

    const startProcess = () => {
        return new Promise( ( fulfill, reject ) => {
            const fileName = 'fide-players-' + moment().format( 'DD-MM-YY' ) + '.zip';
            fulfill( fileName );
        } );
    }

    const download = file => Players.download( file );

    const extract = file => Players.extract( file );

    const createPlayerJson = file => Players.createJson( file );

    const addPlayers = fileName => FirebaseDb.createAll( fileName );

    const updatePlayerRatings = fileName => FirebaseDb.updateRatings( fileName )

    const queryPlayer = ( child, limit ) => FirebaseDb.query( child, limit );

    const playerById = id => FirebaseDb.playerById( id );

    const finish = data => {
        log.trace( 'Process Finished', data );
        process.exit();
    }

    const error = data => {
        log.error( 'Process Error', data.Error );
        process.exit();
    }

    return {
        startProcess        : startProcess,
        download            : download,
        extract             : extract,
        createPlayerJson    : createPlayerJson,
        addPlayers          : addPlayers,
        updatePlayerRatings : updatePlayerRatings,
        queryPlayer         : queryPlayer,
        playerById          : playerById
    };
}
