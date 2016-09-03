const request = require( 'request' );
const teamService = require( './baku.team.service' );
const config = require( '../config/app' );


function loopPlayers() {

    try {

        teamService.getTeams().then( teams => {

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

                    team.players.forEach( player => {

                        player.roundResults.forEach( result => {

                            console.log( result.result );

                            for (var i = 1; i <= 11; i++) {

                                if( result.result.round === i ) {
                                    console.log ( result.result.points );
                                    teamScore['r' + i] = teamScore['r' + i] + result.result.points;
                                    teamScore.total = teamScore.total + result.result.points;
                                }
                            }
                        } );

                    } );

                    sendUpdate( team._id, teamScore );

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
