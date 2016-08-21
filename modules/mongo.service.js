"use strict";

const config = require( '../config/app' );
const fs = require( 'fs' );
const request = require( 'request' );


fs.readFile( '../data/final_baku_open_players.json', 'utf8', ( err, players ) => {

    JSON.parse( players ).forEach( p => {

        let url = config.db.mongo.api + '/players';
        let data = { player: p };

        request.post( url, data, ( err, res, body ) => {
            if( ! err &&  res.statusCode === 200 ) {
                console.log( 'Player added!', body );
            }
        });
    });
} );
