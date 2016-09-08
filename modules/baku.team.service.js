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

function getTeamsByRoundByCountryByScore( round, country ) {

    return new Promose( ( fulfill, reject ) => {
        request.get( url + '/api/teams/rank/' + round + '/' + country, ( error, response, body ) => {
            if ( !error && response.statusCode === 200 ) {
                fulfill( body );
            } else {
                reject( new Error( error ) );
            }
        } );
    } );
}

function getTeamsByRoundByScore( round ) {

    return new Promise( ( fulfill, reject ) => {
        request.get( url + '/api/teams/rank/' + round, ( error, response, body ) => {
            if ( !error && response.statusCode === 200 ) {
                fulfill( body );
            } else {
                reject( new Error( error ) );
            }
        } );
    } );
}

function getTeams() {
    return new Promise( ( fulfill, reject ) => {
        request.get( url + '/api/teams/', ( error, response, body ) => {
            if ( !error && response.statusCode === 200 ) {
                fulfill( body );
            } else {
                reject( new Error( error ) );
            }
        } );
    } );
}

function getTeamsDetail() {

    return new Promise( ( fulfill, reject ) => {
        request.get( url + '/api/teams/detail', ( error, response, body ) => {
            if ( !error && response.statusCode === 200 ) {
                fulfill( body );
            } else {
                reject( new Error( error ) );
            }
        } );
    } )
}

function getTeamsPlayers() {

    return new Promise( ( fulfill, reject ) => {
        request.get( url + '/api/teams/players', ( error, response, body ) => {
            if ( !error && response.statusCode === 200 ) {
                fulfill( body );
            } else {
                reject( new Error( error ) );
            }
        } );
    } );
}

function getCountries() {

    return new Promise( ( fulfill, reject ) => {
        request.get( url + '/api/teams/all/countries', ( error, response, body ) => {
            if ( !error && response.statusCode === 200 ) {
                fulfill( body );
            } else {
                reject( error );
            }
        } );
    } );
}

function getTeamsByCountry( country ) {

    return new Promise( ( fulfill, reject ) => {
        request.get( url + '/api/teams/country/' + country, ( error, response, body ) => {
            if ( !error && response.statusCode === 200 ) {
                fulfill( body );
            } else {
                reject( new Error( error ) );
            }
        } );
    } );
}

function updateTeamRoundRank( id, rank ) {

    let options = {
        url: url + '/api/teams/rank/' + id,
        method: 'PUT',
        json: true,
        body: {
            rank: rank
        }
    };

    return new Promise( ( fulfill, reject ) => {
        request( options, ( err, res, body ) => {
            if ( !err && res.statusCode === 200 ) {
                fulfill( body );
            } else {
                reject( err );
            }

        } )
    } )

}

function updateTeamISO( id, iso ) {

    let options = {
        url: url + '/api/teams/iso/' + id,
        method: 'PUT',
        json: true,
        body: {
            iso: iso
        }
    };

    return new Promise( ( fulfill, reject ) => {
        request( options, ( err, res, body ) => {
            if ( !err && res.statusCode === 200 ) {
                fulfill( body );
            } else {
                reject( err );
            }
        } );
    } );
}

function updatePlayerCurrentRank( id, rank ) {

    let options = {
        url: url + '/api/players/current-rank/' + id,
        method: 'PUT',
        json: true,
        body: {
            rank: rank
        }
    };
    return new Promise( ( fulfill, reject ) => {
        request( options, ( err, res, body ) => {
            if ( !err && res.statusCode === 200 ) {
                fulfill( body );
            } else {
                reject( err );
            }
        } );
    } );
}

function updatePlayerCurrentTotal( id, total ) {

    let options = {
        url: url + '/api/players/current-total/' + id,
        method: 'PUT',
        json: true,
        body: {
            total: total
        }
    };
    return new Promise( ( fulfill, reject ) => {
        request( options, ( err, res, body ) => {
            if ( !err && res.statusCode === 200 ) {
                fulfill( body );
            } else {
                reject( err );
            }
        } );
    } );
}

module.exports = {
    // GET
    getPlayerById,
    getPlayers,

    getCountries,

    getTeams,
    getTeamsDetail,
    getTeamsPlayers,
    getTeamsByCountry,
    getTeamsByRoundByCountryByScore,
    getTeamsByRoundByScore,
    
    // PUT
    updatePlayerCurrentRank,
    updatePlayerCurrentTotal,

    updateTeamISO,
    updateTeamRoundRank
};
