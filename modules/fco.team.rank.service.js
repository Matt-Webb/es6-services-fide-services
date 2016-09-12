"use strict";

const teamService = require( './baku.team.service' );

let round = process.argv[ 2 ];
let TeamDB = process.argv[ 3 ];

if ( round === null || round === undefined ) {
    console.log( 'please specify a round!' );
    return;
}

if ( !TeamDB ) {
    console.log( 'Please tell me which team DB you want to populate? "teams"  or "teams-w2s"' );
    return;
}

let count = 1;

teamService.getTeamsByRoundByScore( round, TeamDB ).then( teams => {

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
            teamService.updateTeamRoundRank( team._id, rank, TeamDB ).then( data => {
                console.log( 'done', count );
            }, error => {
                console.log( error );
            } );
        }, count * 10 );

        count++;
    } );

} );
