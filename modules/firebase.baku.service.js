const data = require( '../data/final_baku_open_players' );
const fs = require( 'fs' );
const config = require( '../config/app.json' );
const firebase = require( "firebase" );


firebase.initializeApp( {
    serviceAccount: config.db.firebase.bakuOlympiad.serviceAccount,
    databaseURL: config.db.firebase.bakuOlympiad.databaseURL
} );

const db = firebase.database();

function compare( a, b ) {
    if ( a.rating < b.rating )
        return -1;
    if ( a.rating > b.rating )
        return 1;
    return 0;
}

let newList = data.sort( compare );

newList.forEach( player => {

    let ref = db.ref( 'players/' + player.id );

    ref.update( player, error => {
        if ( error ) {
            console.log( error );
        }
    } );
} );
