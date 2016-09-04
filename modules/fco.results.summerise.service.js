"use strict";

/*
 * This service update each team with the score for each player and
 * calculates the round by round score and end totl
 */

const request = require( 'request' );
const teamService = require( './baku.team.service' );
const config = require( '../config/app' );

let exception = process.argv[2];

function loopPlayers() {

    try {

        teamService.getTeamsPlayers().then( teams => {

            try {

                JSON.parse( teams ).forEach( team => {

                    let teamScore = {
                        r1: 0,
                        r2: 0,
                        r3: 0,
                        r4: 0,
                        r5: 0,
                        r6: 0,
                        r7: 0,
                        r8: 0,
                        r9: 0,
                        r10: 0,
                        r11: 0,
                        total: 0
                    };

                    if( true /*team.teamName === exception*/ ) {

                        team.players.forEach( player => {

                            if( ! player.roundResults ) {
                                console.log( 'exiting...');
                                return;
                            }

                            player.roundResults.forEach( result => {

                                for (var i = 1; i <= 11; i++) {

                                    if( result.round === i ) {
                                        teamScore['r' + i] = teamScore['r' + i] + result.points;
                                        teamScore.total = teamScore.total + result.points;
                                    }
                                }
                            } );

                        } );

                        sendUpdate( team._id, teamScore );
                    }

                } );

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
