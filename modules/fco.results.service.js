const request = require( 'request' );
const playerService = require( './baku.team.service' );
const config = require( '../config/app' );
let results = [];
const regExp = /\(([^)]+)\)/;

let type = process.argv[ 2 ];
let round = process.argv[ 3 ];

if ( type === null || type === undefined ) {
    console.log( 'please specify a type "open" or "women"' );
    return;
}

if ( round === null || round === undefined ) {
    console.log( 'please specify a round!' );
    return;
}

const json = require( '../data/results/round-' + round + '-' + type );


json.forEach( data => {
    if ( data[ 0 ].indexOf( '/' ) > -1 ) {
        let infoLeft = {
            name: data[ 2 ].replace( '  (w)', '' ).replace( '  (b)', '' ).replace( ',', '' ),
            rating: data[ 3 ],
            result: processResult( data[ 8 ], 'left', regExp.exec( data[ 2 ] )[ 1 ], +round ),
            board: data[ 0 ].split( '/' )[ 1 ]
        };
        results.push( infoLeft );

        let infoRight = {
            name: data[ 6 ].replace( '  (w)', '' ).replace( '  (b)', '' ).replace( ',', '' ),
            rating: data[ 7 ],
            result: processResult( data[ 8 ], 'right', regExp.exec( data[ 6 ] )[ 1 ], +round ),
            board: data[ 0 ].split( '/' )[ 1 ]
        };
        results.push( infoRight );
    }
} );


function addResults( results ) {

    let counter = 0;

    try {

        playerService.getPlayers().then( players => {

            try {
                JSON.parse( players ).forEach( player => {
                    results.forEach( result => {
                        if ( player.name === result.name ) {
                            sendUpdate( player.id, {
                                round: result.round,
                                result: result.result,
                                points: result.points
                            } );
                            counter++;
                        }
                    } );
                } );
            } catch ( e ) {
                console.log( e );
            }

            console.log( 'Matched Found:', counter );

        }, error => {

            console.log( 'error', error );

        } );


    } catch ( e ) {
        console.log( e );
    }


}

addResults( results );


function sendUpdate( id, data ) {

    let options = {
        url: config.db.mongo.api + '/players/result/' + id,
        method: 'PUT',
        json: true,
        body: data
    };

    request( options, ( err, res, body ) => {
        if ( !err && res.statusCode === 200 ) {
            console.log( 'Player updated!', body );
        } else {
            console.log( err );
        }
    } );

}


function processResult( score, side, colour, round ) {

    let segments = score.split( ' ' );

    if ( segments.length !== 3 ) {
        return {
            result: 'unknown',
            points: 0,
            colour: colour
        }
    }

    let result = segments[ 0 ];
    let points = 1;

    if ( side === 'right' ) {
        result = segments[ 2 ];
    }

    let data = {};

    if ( colour === 'b' ) {
        if ( result === '1' || result === '+' ) {
            points = 4;
        }

        if ( result === '½' ) {
            points = 2;
        }
    }
    if ( colour === 'w' ) {
        if ( result === '1' || result === '+' ) {
            points = 3;
        }
        if ( result === '½' ) {
            points = 2;
        }
    }

    return {
        round: round,
        result: result,
        points: points,
        colour: colour
    };
}
