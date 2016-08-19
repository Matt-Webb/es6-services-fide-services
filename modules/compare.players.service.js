"use strict";

const log = require( './logger.service' );
const fs = require( 'fs' );
const JSONStream = require( 'JSONStream' );
const es = require( 'event-stream' );
const readStream = fs.createReadStream( '../data/players.json', {
    encoding: 'utf8'
} );
const parser = JSONStream.parse( '*' );

let matches = new Set();
console.time( "generate-list" );

fs.readFile( '../data/women_players.json', 'utf8', ( err, smallListData ) => {

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

                    if ( checkRating ) {
                        let verifiedPlayer = {
                            id: bigListPlayer.id,
                            name: smallListPlayer.name,
                            name_offical: bigListPlayer.name,
                            rating: parseInt( bigListPlayer.rating, 10 ) || null,
                            rating_unofficial: parseInt( smallListPlayer.rating, 10 ) || null,
                            title: bigListPlayer.title,
                            country: smallListPlayer.country
                        };


                        matches.add( verifiedPlayer );
                    }
                }
            } );
        } ) );

    readStream.on( 'end', function () {

        fs.writeFile( '../data/final_baku_women_players.json', JSON.stringify( [ ...matches ] ), 'UTF8', err => {

            if ( err ) log.trace( err );

            log.trace( 'finished', matches.length );
            console.timeEnd( "generate-list" )
        } );

    } );

} );
