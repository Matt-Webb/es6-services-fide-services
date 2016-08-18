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
let counter = 0;

fs.readFile( '../data/open_players.json', 'utf8', ( err, smallListData ) => {

    let smallListPlayers = JSON.parse( smallListData )[ 0 ].players;

    readStream.pipe( parser )
        .pipe( es.mapSync( bigListPlayer => {
            smallListPlayers.filter( smallListPlayer => {
                if ( bigListPlayer.name === null ) {
                    counter++;
                    return;
                }

                if ( smallListPlayer.name.toString().toLowerCase() === bigListPlayer.name.toString().replace( ",", "" ).toLowerCase() ) {
                    matches.push( bigListPlayer );
                    console.log( `Match found ${smallListPlayer.name} | ${bigListPlayer.name}` );
                }
            } );
        } ) );

    readStream.on( 'end', function () {
        console.log( 'finished', matches, `Players with no name: ${counter}` );
    } );

} );
