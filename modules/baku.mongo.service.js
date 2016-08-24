"use strict";

const config = require( '../config/app' );
const fs = require( 'fs' );
const request = require( 'request' );

let type = process.argv[2];

if( ! type ) {
    console.log( 'Please provide a type "open" or "women" as a parameter!');
    return;
}

fs.readFile( '../data/final_baku_' + type + '_players.json', 'utf8', ( err, players ) => {

    JSON.parse( players ).forEach( player => {

        let options = {
            url: config.db.mongo.api + '/players',
            method: 'POST',
            json: true,
            body: { player: player }
        };

        request.post( options, function ( err, res, body ) {
            if ( !err && res.statusCode === 200 ) {
                console.log( 'Player added!', body.player.name );
            } else {
                console.log( err );
            }
        } );
    } );
} );
