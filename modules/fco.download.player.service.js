"use strict";

/*
 * This service creates a list of json files for each team.
 */

const fs = require( 'fs' );
const playerService = require( './baku.team.service' );


playerService.getPlayers().then( players => {

    JSON.parse( players ).forEach( player => {

        console.log( player.name );

        fs.writeFile( '../data/results/players/' + player._id + '.json', JSON.stringify( player ), 'UTF8', err => {

            if ( err ) console.log( err );

        } );

    });

});
