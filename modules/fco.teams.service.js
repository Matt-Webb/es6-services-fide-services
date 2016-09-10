"use strict";

/*
 * This service puts all the formidable for data teams into a mongo data base.
 */

const request = require( 'request' );
const Converter = require( "csvtojson" ).Converter;
const converter = new Converter( {} );
const log = require( './general/logger.service' );
const config = require( '../config/app' );


let teamsDB = process.argv[ 2 ];
let csvFileName = process.argv[ 3 ];

if ( !teamsDB ) {
    console.log( 'Please tell me which team DB you want to populate? "teams"  or "teams-w2s"' );
    return;
}

if ( !csvFileName ) {
    console.log( 'Please tell me which CVS you want to use?' );
    return;
}

// gets the id from the csv data string:
function getPlayerId( record ) {

    console.log('result', record );

    if ( record ) {
        // old method:
        //let id = record.split( '\t' )[ 4 ];
        let id = record.substr(record.indexOf("– ") + 2).trim();

        if ( typeof id !== undefined || typeof id === 'Number' ) {
            console.log( id );
            return id;
        } else {
            return reject( new Error( 'id is not valid' ) );
        }
    }
};

//end_parsed will be emitted once parsing finished
converter.on( "end_parsed", function ( jsonArray ) {

    let players = [];
    let counter = 0;

    jsonArray.forEach( team => {

        for ( var i = 1; i < 6; i++ ) {
            players.push( getPlayerId( team[ 'Open Board ' + i ] ) );
        }

        for ( var i = 1; i < 6; i++ ) {
            players.push( getPlayerId( team[ 'Women Board ' + i ] ) );
        }

        let options = {
            url: config.db.mongo.api + '/' + teamsDB,
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
                    competitions: 'W2S',
                    players: players
                }
            }
        };

        try {
            setTimeout( () => {
                request.post( options, ( err, res, body ) => {
                    if ( !err && res.statusCode === 200 ) {
                        log.trace( 'Team added!', team.Name );
                    } else {
                        log.error( err );
                    }
                } );
            }, counter * 10 );

            players = [];

        } catch ( e ) {
            console.log( 'ERROR!!!', e );
        }
        counter++;
    } );

} );


converter.fromFile( "../data/" + csvFileName + ".csv", function ( err, result ) {
    if ( err ) {
        log.error( 'Something went wrong!', err );
    } else {
        console.log( 'finished!' );
    }
} );
