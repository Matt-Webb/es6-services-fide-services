"use strict";

const config = require( '../config/app' );
const fs = require( 'fs' );
const request = require( 'request' );
const log = require( '../modules/general/logger.service' );

let type = process.argv[ 2 ] || 'open';

if ( !type || ( type !== 'open' || type !== 'women' ) ) {
    log.trace( 'Please provide a type "open" or "women" as a parameter!' );
    return;
}

fs.readFile( '../data/final_baku_' + type + '_players.json', 'utf8', ( err, players ) => {

    JSON.parse( players ).forEach( player => {

        let options = {
            url: config.db.mongo.api + '/players',
            method: 'POST',
            json: true,
            body: {
                player: player
            }
        };

        request.post( options, ( err, res, body ) => {
            if ( !err && res.statusCode === 200 ) {
                log.trace( 'Player added!', body.player.name );
            } else {
                log.trace( err );
            }
        } );
    } );
} );
