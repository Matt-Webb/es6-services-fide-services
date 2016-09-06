"use strict";

/*
 * This service puts all the formidable for data teams into a mongo data base.
 */

const request = require( 'request' );
const Converter = require( "csvtojson" ).Converter;
const converter = new Converter( {} );
const log = require( './general/logger.service' );
const config = require( '../config/app' );


// gets the id from the csv data string:
function getPlayerId( record ) {
    let id = record.split( '\t' )[ 4 ];

    if ( typeof id !== undefined || typeof id === 'Number' ) {
        return id;
    } else {
        return reject( new Error( 'id is not valid' ) );
    }
};

//end_parsed will be emitted once parsing finished
converter.on( "end_parsed", function ( jsonArray ) {

    let players = [];
    let counter = 0;

    jsonArray.forEach( team => {

        for ( var i = 1; i < 6; i++ ) {
            players.push( getPlayerId( team[ 'Open player ' + i ] ) );
        }

        for ( var i = 1; i < 6; i++ ) {
            players.push( getPlayerId( team[ 'Women player ' + i ] ) );
        }

        let options = {
            url: config.db.mongo.api + '/teams',
            method: 'POST',
            json: true,
            body: {
                team: {
                    name: team.Name,
                    teamName: team[ 'Your team name' ],
                    country: team[ 'Country of Residence' ],
                    openGold: team[ 'Open section Gold medal winners' ],
                    openSilver: team[ 'Open section Silver medal winners' ],
                    openBronze: team[ 'Open section Bronze medal winners' ],
                    openIndGold: team[ 'Open section individual Gold medal winner' ],
                    womenGold: team[ 'Women\'s section Gold medal winners' ],
                    womenSilver: team[ 'Women\'s section Silver medal winners' ],
                    womenBronze: team[ 'Women\'s section Bronze medal winners' ],
                    womenIndGold: team[ 'Women\'s section individual Gold medal winner' ],
                    playersIds: players,
                    players: players
                }
            }
        };

        try {

            request.post( options, ( err, res, body ) => {
                if ( !err && res.statusCode === 200 ) {
                    log.trace( 'Team added!', team.Name );

                } else {
                    log.error( err );
                }
            } );
            players = [];

        } catch (e) {
            console.log( 'ERROR!!!', e );
        }
    } );

} );


converter.fromFile( "../data/exceptions-new.csv", function ( err, result ) {
    if ( err ) {
        log.error( 'Something went wrong!', err );
    } else {
        console.log( 'finished!' );
    }
} );
