"use strict";

/*
 * This service gets a list of countries then generates a list of teams for each country
 */

const teamService = require( './baku.team.service' );
const fs = require( 'fs' );

teamService.getCountries().then( countries => {

    JSON.parse( countries ).forEach( country => {

        teamService.getTeamsByCountry( country._id.country ).then( list => {
            try {
                fs.writeFile( '../data/results/teams-by-country/' + country._id.country + '.json', list , 'UTF8', err => {

                    if ( err ) console.log( err );
                    console.log( 'File written for ', country._id.country );
                } );
            } catch (e) {
                console.log( e );
            }
        } );

    });

}, function( error ) {
    console.log( error );
} );
