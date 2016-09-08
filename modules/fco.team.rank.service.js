"use strict";

const teamService = require( './baku.team.service' );

let round = process.argv[ 2 ];

if ( round === null || round === undefined ) {
    console.log( 'please specify a round!' );
    return;
}
//const teams = require('../data/team-score-by-round/r1.json' );

let count = 1;

teamService.getTeamsByRoundByScore( round ).then( teams => {

    JSON.parse( teams ).forEach( team => {

        let pointsForRound = team.score[ 0 ][ 'r' + round ].score;
        let total = team.score[ 0 ][ 'r' + round ].total;

        let rank = {
            points: pointsForRound,
            total: total,
            round: round,
            roundRank: count
        };

        setTimeout( () => {
            console.log( 'setting request!' );
            teamService.updateTeamRoundRank( team._id, rank ).then( data => {
                console.log( 'done', count );
            }, error => {
                console.log( error );
            } );
        }, count * 50 );

        count++;
    } );

} );
