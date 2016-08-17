'use strict';

const express = require( 'express' );
const app = express();
const bodyParser = require( 'body-parser' );
const port = process.env.PORT || 8080;
const service = require( './main' )();
const config = require( './config/app' );
const log = require( './modules/logger.service' );

app.use( bodyParser.urlencoded( {
    extended: true
} ) );

app.use( bodyParser.json() );

app.get( '/api/player/:id', ( req, res ) => {
    log.trace( 'Request for player', req.params.id );
    service.playerById( req.params.id )
    .then( data => res.send( data ),
    error => res.status( 404 ).send( error ) )
});

app.get( '/api/upload/:fileName', ( req, res ) => {
    log.trace( 'Upload send', req.params.fileName );
    service.updatePlayerRatings( req.params.fileName )
    .then( data => res.send( data ),
    error => res.status( 500 ).send( error ))
});

app.get( '/api/download/:file', ( req, res ) => {
    log.trace( 'Download requested', req.params.file );
    service.startProcess()
        .then( service.download )
        .then( service.extract )
        .then( data => res.send( data ),
        error => res.status( 404 ).send( error ) );
});

app.get( '/api/create', ( req, res ) => {
    log.trace( 'Request for created json feed' );
    service.startProcess()
        .then( service.createPlayerJson( config.db.fide.xmlFile ) )
        .then( data => res.send( data ),
        error => res.status( 404 ).send( error ) );
})

app.listen( port );
log.info( 'Server started on port', port );

service.createPlayerJson( config.db.fide.xmlFile );
