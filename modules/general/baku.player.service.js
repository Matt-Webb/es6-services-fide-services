"use strict";

/* dependancies */
const request = require( 'request' );
const fs = require( 'fs' );
const cheerio = require( 'cheerio' );
const config = require( '../config/app.json' );

const teams = [];

let type = process.argv[2];

if( ! type ) {
    console.log( 'Please provide a type "open" or "womens" as a parameter!');
    return;
}

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

/**
 *  In certain cases we are present with different TD elements, examples such as:
 *  <td>&nbsp;<span>Guseinov Gadir</span></td>
 *  <td><span>2577</span>&nbsp;</td>
 *  <td>&nbsp;Trajkovic Predrag</td>
 *  Here we need to account for the 'randomly' inserted span element by calling .children for the data.
**/
const cleanseInfo = data => {
    if ( data ) {

        let info = data.children[ 0 ].data;

        if( info === undefined ) {
            info = data.children[0].children[0].data;
        }

        if( info === String.fromCharCode(160) ) {
            if( data.children[0].next !== null) {

                info = data.children[0].next.children[0].data;
                console.log( 'Exception!', info );
            }

        }

        if( info ) {
            info = info.trim();
        }
        return info;
    }
}

/**
 *
 **/
const processTeams = ( data, olympiadEvent ) => {

    return new Promise( ( fulfill, reject ) => {

        let $ = cheerio.load( data );

        try {

            $( ".country" ).each( function () {

                let data = $( this );
                let country = data.attr( 'tabindex' );
                let team = new Team();

                team.country = country;

                if ( country ) {

                    console.log( 'found!', country );

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
                    boardOne.event = olympiadEvent;
                    team.players.push( boardOne );

                    let boardTwo = new Player();
                    boardTwo.board = 2;
                    boardTwo.title = cleanseInfo( tableRecord[ '12' ] );
                    boardTwo.name = cleanseInfo( tableRecord[ '13' ] );
                    boardTwo.rating = cleanseInfo( tableRecord[ '14' ] );
                    boardTwo.country = country;
                    boardTwo.event = olympiadEvent;
                    team.players.push( boardTwo );

                    let boardThree = new Player();
                    boardThree.board = 3;
                    boardThree.title = cleanseInfo( tableRecord[ '15' ] );
                    boardThree.name = cleanseInfo( tableRecord[ '16' ] );
                    boardThree.rating = cleanseInfo( tableRecord[ '17' ] );
                    boardThree.country = country;
                    boardThree.event = olympiadEvent;
                    team.players.push( boardThree );


                    let boardFour = new Player();
                    boardFour.board = 4;
                    boardFour.title = cleanseInfo( tableRecord[ '18' ] );
                    boardFour.name = cleanseInfo( tableRecord[ '19' ] );
                    boardFour.rating = cleanseInfo( tableRecord[ '20' ] );
                    boardFour.country = country;
                    boardFour.event = olympiadEvent;
                    team.players.push( boardFour );

                    let boardFive = new Player();
                    boardFive.board = 5;
                    boardFive.title = cleanseInfo( tableRecord[ '21' ] );
                    boardFive.name = cleanseInfo( tableRecord[ '22' ] );
                    boardFive.rating = cleanseInfo( tableRecord[ '23' ] );
                    boardFive.country = country;
                    boardFive.event = olympiadEvent;
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
const getPlayers = ( section, output, olympiadEvent ) => {

    request( {
        uri: section,
    }, ( error, response, body ) => {

        processTeams( body, olympiadEvent )
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

// Get the OPEN / WOMENS players:
getPlayers( config[ type ].url, config[ type ].output, type );
