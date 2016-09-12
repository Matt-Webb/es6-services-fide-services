"use strict";

const teamService = require( './baku.team.service' );
const players = require( '../dummy/players.json' );
const teams = require( '../dummy/teams.json' );

let playerTally = [];

players.forEach( player => {

    let playerPicked = {
        id: player._id,
        name: player.name,
        picked: 0
    };

    teams.forEach( team => {

        team.players.forEach( p => {

            if ( player._id === p ) {
                playerPicked.picked += 1;
            }
        } );

    } );

    playerTally.push( playerPicked );
} );


playerTally.forEach( player => {

    teamService.updatePlayerPickedCount( player.id, player.picked ).then( player => {
        console.log( 'Team updated', player.name, player.picked );
    });

});
