"use strict";

/*
 * This service creates a list of json files for each team.
 */

const fs = require( 'fs' );
const teamService = require( './baku.team.service' );

let round = process.argv[2];

if( ! round ) {
    console.log( 'Please provide a round for this data!');
    return;
}

teamService.getTeamsDetail().then( teams => {

    console.log( 'Got teams!', JSON.parse( teams ).length );

    JSON.parse( teams ).forEach( team => {

        console.log( team._id );

        fs.writeFile( '../data/results/teams/round-' + round +'/' + team._id + '.json', JSON.stringify( team ), 'UTF8', err => {

            if ( err ) console.log( err );

        } );

    });

});
