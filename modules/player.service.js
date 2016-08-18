"use strict";

const http = require( 'http' );
const fs = require( 'fs' );
const AdmZip = require( 'adm-zip' );
const bigXml = require( 'big-xml' );
const log = require( './logger.service' );


class FidePlayerService {

    constructor( properties ) {
        this.properties = properties;
        this.fide = properties.db.fide;
    }

    /**
     * This method does a http GET request to the fide download page for a zip XML data file.
     * @return { promise }
     * @param { string } fileName
     */
    download( fileName ) {
        log.trace( 'Initialised Download', fileName );
        const that = this;
        return new Promise( ( fulfill, reject ) => {
            try {
                let file = fs.createWriteStream( `${that.fide.folder}/${fileName}` );

                log.trace( 'Executing HTTP GET', that.fide.url );

                http.get( that.fide.url, response => {
                    response.pipe( file );

                    log.trace( 'Successful response.' );

                    file.on( 'finish', () => {
                        file.close();
                        fulfill( fileName );
                    } );
                } ).on( 'error', error => {
                    fs.unlink( that.fide.folder );

                    log.error( 'Error on HTTP GET', error );

                    reject( new Error( error ) );
                } );
            } catch ( error ) {
                log.error( 'Unexpected Error', error );
                reject( new Error( error ) );
            }
        } );
    }

    /**
     * This method takes the unzipped xml file and reads it into JSON where all other processes
     * outside of this service can just that data source.
     * @return { promise }
     * @param { string } file
     **/
    createJson( file ) {

        log.trace( 'Create Json method started...', file );

        const reader = bigXml.createReader( this.properties.db.fide.folder + this.properties.db.fide.xmlFile, /^(player)$/, {
            gzip: false
        } );

        let counter = 0;
        let players = [];

        return new Promise( ( fulfill, reject ) => {

            try {

                reader.on( 'record', record => {

                    let p = record.children;

                    let player = {}

                    try {

                        let rating = p[ 8 ];

                        player = {
                            id: parseInt( p[ 0 ].text, 10 ) || null,
                            name: p[ 1 ].text || null
                        };

                        if ( typeof rating !== 'undefined' || typeof rating.text !== 'undefined' ) {
                            player.rating = parseInt( p[ 8 ].text, 10 ) || null;
                        }

                    } catch ( e ) {
                        console.log( e );
                    }

                    try {

                        //log.trace( 'Player added! ', counter )
                        players.push( player );
                        counter++;

                    } catch ( error ) {
                        reject( new Error( error ) );
                        log.trace( new Error( error ) );
                    }

                } ).on( 'end', () => {

                    log.trace( 'About to write data to file...' );

                    fs.writeFile( 'data/players.json', JSON.stringify( players ), 'UTF8', err => {

                        if ( err ) log.trace( err );

                        log.trace( "Success", `Number of records processed ${counter}` );
                    } );

                    fulfill( file );
                } );

            } catch ( e ) {
                log.trace( 'Error', e );
            }
        } );

    }

    /**
     * This method takes a .zip file and unzips it to the same folder.
     * @return { promise }
     * @param { string } file
     */
    extract( file ) {
        log.trace( 'Extracting XML file from Zip', file );

        const that = this;

        return new Promise( ( fulfill, reject ) => {

            if ( file.indexOf( '.zip' ) === -1 ) {
                reject( new Error( 'File must be stored as a .zip' ) );
            }

            let zip = new AdmZip( `${that.fide.folder}/${file}` );
            let zipEntries = zip.getEntries();

            zipEntries.forEach( zipEntry => {
                if ( zipEntry.entryName === that.fide.xmlFile ) {
                    try {
                        zip.extractEntryTo( that.fide.xmlFile, that.fide.folder, false, true );

                        log.trace( 'Extract complete.' );

                        fulfill( 'Extract complete.' );

                    } catch ( error ) {
                        log.trace( 'Error', error );

                        reject( new Error( error ) );
                    }
                } else {
                    log.trace( 'Error Unable to match file' );

                    reject( new Error( 'Unable to match file' ) );
                }
            } );
        } );
    }
}

module.exports = FidePlayerService;
