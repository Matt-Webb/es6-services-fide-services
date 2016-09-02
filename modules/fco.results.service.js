const json = require( '../data/results/round-1' );
let results = [];
const regExp = /\(([^)]+)\)/;

json.forEach( data => {
    if ( data[ 0 ].indexOf( '/' ) > -1 ) {

        let infoLeft = {
            name: data[ 2 ].replace('  (w)','').replace('  (b)','').replace(',',''),
            rating: data[ 3 ],
            result: processResult( data[ 8 ], 'left', regExp.exec( data[ 2 ] )[ 1 ] ),
            board: data[ 0 ].split( '/' )[ 1 ]
        };

        let infoRight = {
            name: data[ 6 ].replace('  (w)','').replace('  (b)','').replace(',',''),
            rating: data[ 7 ],
            result: processResult( data[ 8 ], 'right', regExp.exec( data[ 6 ] )[ 1 ] ),
            board: data[ 0 ].split( '/' )[ 1 ]
        };

        console.log( infoLeft );
        console.log( infoRight );
        console.log( '----------------------------------------------' );
        console.log();
        results.push( infoLeft );
        results.push( infoRight );
    }
} );

function processResult( score, side, color ) {

    let segments = score.split( ' ' );

    if ( segments.length !== 3 ) {
        return {
            result: 'unknown',
            points: 0,
            color: color
        }
    }

    let result = segments[ 0 ];
    let points = 1;

    if ( side === 'right' ) {
        result = segments[ 2 ];
    }

    let data = {};

    if ( color === 'b' ) {
        if ( result === '1' || result === '+' ) {
            points = 4;
        }

        if ( result === '½' ) {
            points = 2;
        }
    }
    if ( color === 'w' ) {
        if ( result === '1' || result === '+' ) {
            points = 3;
        }
        if ( result === '½' ) {
            points = 2;
        }
    }

    return {
        result: result,
        points: points,
        color: color
    };
}
