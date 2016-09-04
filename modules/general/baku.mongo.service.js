"use strict";

const config = require( '../config/app' );
const fs = require( 'fs' );
const request = require( 'request' );
const log = require( '../modules/general/logger.service' );

let type = process.argv[ 2 ] || 'open';

fs.readFile( '../data/baku-' + type + '.json', 'utf8', ( err, players ) => {

    JSON.parse( players ).forEach( player => {

        let options = {
            url: config.db.mongo.api + '/players',
            method: 'POST',
            json: true,
            body: {
                player: {
                    id: player.FideID,
                    rank: player[ 'No.' ],
                    name: player.Name.trim(),
                    rating: player.Rtg,
                    title: player.title,
                    country: player.Team,
                    team: player.Team,
                    fed: player.FED,
                    board: player[ 'Bo.' ],
                    eventType: type
                }
            }
        };

        request.post( options, ( err, res, body ) => {
            if ( !err && res.statusCode === 200 ) {
                log.trace( 'Player added!' );
            } else {
                log.trace( err );
            }
        } );
    } );
} );
