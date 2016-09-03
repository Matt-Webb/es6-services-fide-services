"use strict";

const request = require( 'request' );
const url = 'http://localhost:3000';

function getPlayerById( id ) {

    return new Promise( ( fulfill, reject ) => {

        request.get( url + '/api/players/' + id, function ( error, response, body ) {
            if ( !error && response.statusCode === 200 ) {
                fulfill( body );
            } else {
                reject( new Error( error ) );
            }
        } );

    } );
};

function getPlayers() {

    return new Promise( ( fulfill, reject ) => {

        request.get( url + '/api/players/', ( error, response, body ) => {

            if ( !error && response.statusCode === 200 ) {
                fulfill( body );
            } else {
                reject( new Error( error ) );
            }
        } );
    } );
}

module.exports = {
    getPlayerById,
    getPlayers
};
