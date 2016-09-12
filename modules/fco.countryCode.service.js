"use strict";

/*
 * This service updates all the country codes iso for each team!
 */

const teamService = require( './baku.team.service' );
const countryData = require( '../data/country/codes.json' );
let counter = 0;
let teamsDB = process.argv[ 2 ];

if ( !teamsDB ) {
    console.log( 'Please tell me which team DB you want to populate? "teams"  or "teams-w2s"' );
    return;
}


teamService.getTeams( teamsDB ).then( teams => {

    JSON.parse( teams ).forEach( team => {

        console.log( team.country );

        countryData.forEach( info => {

            if ( info.country === team.country ) {
                try {
                    setTimeout(() => {
                        teamService.updateTeamISO( team._id, info.iso, teamsDB ).then(
                            data => {
                                console.log( 'Success', data );
                            },
                            error => {
                                console.log( 'Error', error );
                            }
                        );
                    }, counter * 10);

                    counter++;

                } catch (e) {
                    console.log( e );
                }
            }
        } );
    } );
} );
