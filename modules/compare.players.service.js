"use strict";

const log = require( './general/logger.service' );
const fs = require( 'fs' );
const JSONStream = require( 'JSONStream' );
const es = require( 'event-stream' );
const readStream = fs.createReadStream( '../data/players.json', {
    encoding: 'utf8'
} );
const parser = JSONStream.parse( '*' );

let type = process.argv[ 2 ];
let createInvalidList = false;

if ( !type ) {
    console.log( 'Please provide a type "open" or "women" as a parameter!' );
    return;
}

let matches = new Set();
let whiteList = JSON.parse(fs.readFileSync('../data/whitelist.json', 'utf8'));

console.time( "generate-list" );

fs.readFile( '../data/baku_' + type + '_players.json', 'utf8', ( err, smallListData ) => {

    let smallListPlayers = [];

    JSON.parse( smallListData ).forEach( team => {
        team.players.forEach( player => smallListPlayers.push( player ) );
    } )

    readStream.pipe( parser )
        .pipe( es.mapSync( bigListPlayer => {
            smallListPlayers.filter( smallListPlayer => {
                if ( bigListPlayer.name === null ) {
                    return;
                }

                // check to see if we can find the player by name:
                let checkName = smallListPlayer.name.toString().toLowerCase() === bigListPlayer.name.toString().replace( ",", "" ).toLowerCase();

                if ( checkName ) {

                    // as duplicated names can appear we compare the rating to what we expect it to be:
                    let checkRating = parseInt( smallListPlayer.rating, 10 ) === parseInt( bigListPlayer.rating, 10 );

                    let verifiedPlayer = {
                        id: bigListPlayer.id,
                        name: smallListPlayer.name,
                        nameOfficial: bigListPlayer.name,
                        rating: parseInt( smallListPlayer.rating, 10 ) || null,
                        ratingOfficial: parseInt( bigListPlayer.rating, 10 ) || null,
                        title: bigListPlayer.title,
                        country: smallListPlayer.country,
                        isoCountry: bigListPlayer.country,
                        eventType: smallListPlayer.event
                    };

                    if ( checkRating ) {
                        matches.add( verifiedPlayer );

                    } else {

                        // loop through the whitelist to see if our player should be added!
                        whiteList.forEach( id => {
                            if( id === bigListPlayer.id ) {
                                matches.add( verifiedPlayer );
                                log.trace( 'Player from White List cleared for action!' );
                            }
                        });

                        // create a new invalid list:
                        if( createInvalidList ) {

                            fs.appendFile( '../data/invalid_players.json', JSON.stringify( verifiedPlayer ), err => {
                                if ( err ) throw err;
                                log.trace( 'Invalid player added to list', smallListPlayer.name, smallListPlayer.rating );
                            } );

                        }

                    }
                }
            } );
        } ) );

    readStream.on( 'end', function () {

        fs.writeFile( '../data/final_baku_' + type + '_players.json', JSON.stringify( [ ...matches ] ), 'UTF8', err => {

            if ( err ) log.trace( err );

            log.trace( 'finished', matches.length );
            console.timeEnd( "generate-list" );
        } );

    } );

} );
