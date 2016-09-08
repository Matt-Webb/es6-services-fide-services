"use strict";

const teamService = require( './baku.team.service' );

let round = process.argv[ 2 ];

if ( round === null || round === undefined ) {
    console.log( 'please specify a round!' );
    return;
}

let count = 1;

teamService.getCountries().then( country => {

    teamService.getTeamsByRoundByCountryByScore( round, country ).then( players => {

        JSON.parse( players ).forEach( player => {

            let pointsForRound = player.score[ 0 ][ 'r' + round ].score;
            let total = player.score[ 0 ][ 'r' + round ].total;

            let rank = {
                points: pointsForRound,
                total: total,
                round: round,
                roundRank: count
            };

            teamService.updateTeamRoundRank( player._id, rank ).then( data => {
                console.log( data );
            }, error => {
                console.log( error );
            } );

            count++;
        } );
    } );

} )
