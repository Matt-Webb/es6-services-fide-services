"use strict";

const config = require( './config/app' );
const moment = require( 'moment' );
const log = require( './modules/general/logger.service' );
const FidePlayerService = require( './modules/fide.player.service' );
const FirebaseService = require( './modules/fide.firebase.service' );
const Players = new FidePlayerService( config );
const FirebaseDb = new FirebaseService( config );


module.exports = function() {

    const startProcess = () => {
        return new Promise( ( fulfill, reject ) => {
            const fileName = 'fide-players-' + moment().format( 'DD-MM-YY' ) + '.zip';
            fulfill( fileName );
        } );
    }

    // Get Fide Players:
    const download = file => Players.download( file );

    // Extract zip of Fide Players:
    const extract = file => Players.extract( file );

    // Create a JSON file of Fide Players:
    const createPlayerJson = file => Players.createJson( file );

    // Add all Fide Players to Firebase DB:
    const addPlayers = fileName => FirebaseDb.createAll( fileName );

    // Update existing players ratings in Firebase:
    const updatePlayerRatings = fileName => FirebaseDb.updateRatings( fileName )

    // Query exiting players in Firebase:
    const queryPlayer = ( child, limit ) => FirebaseDb.query( child, limit );

    // Get a player from the Firebase DB:
    const playerById = id => FirebaseDb.playerById( id );

    // On comlete:
    const finish = data => {
        log.trace( 'Process Finished', data );
        process.exit();
    }

    // On error:
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
