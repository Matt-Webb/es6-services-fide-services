"use strict";

const log = require( './logger.service' );
const fs = require( 'fs' );
const JSONStream = require( 'JSONStream' );
const es = require( 'event-stream' );
const readStream = fs.createReadStream( '../data/players.json', {
    encoding: 'utf8'
} );
const parser = JSONStream.parse( '*' );

let matches = [];
console.time( "generate-list" );

fs.readFile( '../data/open_players.json', 'utf8', ( err, smallListData ) => {

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

                if ( smallListPlayer.name.toString().toLowerCase() === bigListPlayer.name.toString().replace( ",", "" ).toLowerCase() ) {

                    let verifiedPlayer = {
                        id: bigListPlayer.id,
                        name: smallListPlayer.name,
                        name_offical: bigListPlayer.name,
                        rating: parseInt( bigListPlayer.rating, 10 ) || null,
                        rating_unofficial: parseInt( smallListPlayer.rating, 10 ) || null,
                        title: bigListPlayer.title,
                        country: smallListPlayer.country
                    };

                    matches.push( verifiedPlayer );
                }
            } );
        } ) );

    readStream.on( 'end', function () {

        fs.writeFile( '../data/final_baku_open_players.json', JSON.stringify( matches ), 'UTF8', err => {

            if ( err ) log.trace( err );

            log.trace( 'finished', matches.length );
            console.timeEnd( "generate-list" )
        } );

    } );

} );
