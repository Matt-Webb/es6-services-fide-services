"use strict";

const fidePlayers = require( '../data/players' );
const bakuPlayers = require( '../data/open_players' );

let comparePlayer = ( main , subset ) => {

    console.log( 'Comparing players, this could take a while' );

    for( let player of main ) {

        console.log( player )
        // for( let p of subset ) {
        //
        //     if( p.players[0].name === player);
        //
        // }

    }
}

comparePlayer( fidePlayers, bakuPlayers );
