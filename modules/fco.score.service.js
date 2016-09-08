"use strict";

/*
 * This service update each team with the score for each player and
 * calculates the round by round score and end totl
 */

const request = require( 'request' );
const teamService = require( './baku.team.service' );
const config = require( '../config/app' );

function loopPlayers() {

    try {
        teamService.getTeamsPlayers().then( teams => {
            try {
                let counter = 0;

                JSON.parse( teams ).forEach( team => {

                    let teamScore = {
                        r1: {
                            score: 0,
                            total: 0
                        },
                        r2: {
                            score: 0,
                            total: 0
                        },
                        r3: {
                            score: 0,
                            total: 0
                        },
                        r4: {
                            score: 0,
                            total: 0
                        },
                        r5: {
                            score: 0,
                            total: 0
                        },
                        r6: {
                            score: 0,
                            total: 0
                        },
                        r7: {
                            score: 0,
                            total: 0
                        },
                        r8: {
                            score: 0,
                            total: 0
                        },
                        r9: {
                            score: 0,
                            total: 0
                        },
                        r10: {
                            score: 0,
                            total: 0
                        },
                        r11: {
                            score: 0,
                            total: 0
                        },
                        total: 0
                    };

                    team.players.forEach( player => {

                        if ( !player.roundResults ) {
                            console.log( 'exiting...' );
                            return;
                        }

                        player.roundResults.forEach( result => {

                            for ( var i = 1; i <= 11; i++ ) {

                                if ( result.round === i ) {
                                    teamScore[ 'r' + i ].score = teamScore[ 'r' + i ].score + result.points;
                                    teamScore.total = teamScore.total + result.points;
                                }
                            }
                        } );
                    } );

                    // create a cummulative list of score for rank tracking:
                    let total = 0;
                    for ( let i = 1; i <= 11; i++ ) {
                        total += teamScore[ 'r' + i ].score;
                        teamScore[ 'r' + i ].total = total;
                    }

                    setTimeout( () => {
                        sendUpdate( team._id, teamScore );
                    }, counter * 10 );

                    counter++;

                } );
                console.log( 'complete!' );
            } catch ( e ) {
                console.log( e );
            }

        }, error => {
            console.log( 'error', error );
        } );
    } catch ( e ) {
        console.log( e );
    }
}

loopPlayers();


function sendUpdate( id, score ) {

    let options = {
        url: config.db.mongo.api + '/teams/subtotal/' + id,
        method: 'PUT',
        json: true,
        body: score
    };

    request( options, ( err, res, body ) => {
        if ( !err && res.statusCode === 200 ) {
            console.log( 'Team updated!' );
        } else {
            console.log( err );
        }
    } );

}
