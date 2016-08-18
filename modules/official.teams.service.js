"use strict";

/* dependancies */
const request = require( 'request' );
const fs = require( 'fs' );
const cheerio = require( 'cheerio' );
const config = require( '../config/app.json' );

const teams = [];

class Player {
    constructor() {
        this.board = null;
        this.title = null;
        this.name = null;
        this.rating = null;
    }
}

class Team {
    contructor() {
        this.country = null;
        this.captain = null;
        this.players = [];
    }
}

const cleanseInfo = data => {
    if ( data ) {
        let info = data.children[ 0 ].data;
        if ( info ) {
            info = info.trim();
        }
        return info;
    }
}

/*
 *
 */
const processTeams = data => {

    return new Promise( ( fulfill, reject ) => {

        let $ = cheerio.load( data );

        try {

            $( ".country" ).each( function () {

                let data = $( this );
                let country = data.attr( 'tabindex' );
                let team = new Team();

                team.country = country;

                if ( country ) {

                    let tableRecord = data.find( 'table td' );
                    team.players = [];

                    let captain = new Player();
                    captain.title = cleanseInfo( tableRecord[ '3' ] )
                    captain.name = cleanseInfo( tableRecord[ '4' ] );
                    captain.rating = cleanseInfo( tableRecord[ '5' ] );

                    team.captain = captain;

                    let boardOne = new Player();
                    boardOne.board = 1;
                    boardOne.title = cleanseInfo( tableRecord[ '9' ] );
                    boardOne.name = cleanseInfo( tableRecord[ '10' ] );
                    boardOne.rating = cleanseInfo( tableRecord[ '11' ] );
                    boardOne.country = country;
                    team.players.push( boardOne );


                    let boardTwo = new Player();
                    boardTwo.board = 2;
                    boardTwo.title = cleanseInfo( tableRecord[ '12' ] );
                    boardTwo.name = cleanseInfo( tableRecord[ '13' ] );
                    boardTwo.rating = cleanseInfo( tableRecord[ '14' ] );
                    boardTwo.country = country;
                    team.players.push( boardTwo );


                    let boardThree = new Player();
                    boardThree.board = 3;
                    boardThree.title = cleanseInfo( tableRecord[ '15' ] );
                    boardThree.name = cleanseInfo( tableRecord[ '16' ] );
                    boardThree.rating = cleanseInfo( tableRecord[ '17' ] );
                    boardThree.country = country;
                    team.players.push( boardThree );


                    let boardFour = new Player();
                    boardFour.board = 4;
                    boardFour.title = cleanseInfo( tableRecord[ '18' ] );
                    boardFour.name = cleanseInfo( tableRecord[ '19' ] );
                    boardFour.rating = cleanseInfo( tableRecord[ '20' ] );
                    boardFour.country = country;
                    team.players.push( boardFour );

                    let boardFive = new Player();
                    boardFive.board = 5;
                    boardFive.title = cleanseInfo( tableRecord[ '21' ] );
                    boardFive.name = cleanseInfo( tableRecord[ '22' ] );
                    boardFive.rating = cleanseInfo( tableRecord[ '23' ] );
                    boardFive.country = country;
                    team.players.push( boardFive );

                    teams.push( team );

                }
            } );

            fulfill( teams );

        } catch ( err ) {
            reject( new Error( err ) );
        }
    } );
}


/*
 * This request immediately involves the request for player data
 */
const getPlayers = ( section, output ) => {

    request( {
        uri: section,
    }, ( error, response, body ) => {

        processTeams( body )
            .then( teams => {

                fs.appendFile( output, JSON.stringify( teams ), err => {
                    if ( err ) throw err;
                    console.log( 'Teams created' );
                } );

            }, error => {
                console.log( error.message );
            } );
    } );
}


// Get the OPEN players:
getPlayers( config.open.url, config.open.output );

// Get the WOMENS players:
getPlayers( config.womens.url, config.womens.output );
// module.exports = getPlayers;
