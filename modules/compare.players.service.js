"use strict";

const fidePlayers = require( '../data/players' );
const bakuPlayers = require( '../data/open_players' );
const log = require( './logger.service' );

let comparePlayer = ( main , subset ) => {

    console.log( 'Comparing players, this could take a while' );
    let counter = 0;

    for( let player of main ) {

        let officialName = player.name;

        for( let team of subset ) {

            for( let p of team.players ) {

                let bakuName = p.name;

                if( bakuName.toString().toLowerCase() === officialName.toString().replace(",","").toLowerCase() ) {
                    log.trace( `Match found! Baku List: ${bakuName} (${p.rating}) | Official List: ${officialName} (${player.rating})` );
                    console.log( player );
                }
            }

            counter++;
        }
        counter++;
    }

    console.log('Complete', counter );
}

comparePlayer( fidePlayers, bakuPlayers );
