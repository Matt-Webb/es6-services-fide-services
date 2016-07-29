'use strict';

const moment = require( 'moment' );
const firebase = require( 'firebase' );
const bigXml = require( 'big-xml' );
const log = require( './logger.service' );

class FirebasePlayerService {

    constructor( properties ) {
        this.properties = properties;
        this.firebase = firebase.initializeApp( {
            databaseURL: properties.db.firebase.databaseURL,
            serviceAccount: properties.db.firebase.serviceAccount
        } );
        this.db = this.firebase.database();
    }

    /**
     * This creates all the initial player records within firebase, without a rating reference.
     * @callback createAll
     * @param { string } fileName
     */
    createAll( fileName ) {

        const that = this;
        const reader = bigXml.createReader( this.properties.db.fide.folder + this.properties.db.fide.xmlFile, /^(player)$/, {
            gzip: false
        }) ;

        const currentProcess = Date.now();
        const ref = that.db.ref( 'players/' );

        return new Promise( function( fulfill, reject ) {

            reader.on( 'record', function( record ) {

                let p = record.children;
                let player = {};

                // below we create a dynamic key using an object literal obj['name'], this allows use to use
                // the fide id as the firebase reference id.
                player[p[0].text] = {
                    id: parseInt(p[0].text, 10) || null,
                    name: p[1].text || null,
                    country: p[2].text || null,
                    sex: p[3].text || null,
                    title: p[4].text || null,
                    womens_title: p[5].text || null,
                    online_title: p[6].text || null,
                    foa_title: p[7].text || null,
                    games: parseInt(p[9].text) || null,
                    k_factor: parseInt(p[10].text, 10) || null,
                    birth_year: parseInt(p[17].text, 10) || null,
                    flag: p[18].text || null
                };

                try {
                    if ( player[p[0].text].rating !== null && player[p[0].text].name !== null && player[p[0].text].country === 'ENG') {
                        ref.update( player, function( error ) {
                            if ( error ) {
                                reject( new Error( error ) );
                            }
                        });
                    }
                } catch ( error ) {
                    reject( new Error( error ) );
                }
            } ).on( 'end', function() {
                fulfill( fileName );
            } );
        } );
    }

    /**
     * This will update each rating record by populating the ratingHistory object property.
     * @callback updateRatings
     * @param { string } fileName
     */
    updateRatings( fileName ) {

        log.info('Updating ratings.');
        const that = this;
        const currentProcess = Date.now();
        const reader = bigXml.createReader( that.properties.db.fide.folder + that.properties.db.fide.xmlFile, /^(player)$/, {
            gzip: false
        } );

        return new Promise( function( fulfill, reject ) {

            reader.on( 'record', function( record ) {

                let refRating;
                let player = record.children;
                let id = parseInt(player[0].text,10);

                if ( id === 418250 ) {

                    refRating = that.db.ref( 'players/' + id + '/rating' );

                    let rating = {
                        rating: parseInt( player[8].text, 10 ) || null,
                        fromFile: fileName,
                        uploaded: currentProcess,
                        date: moment().format('Do MMM YY')
                    };

                    try {

                        if(!refRating) {
                            reject( new Error( 'Ref Rating is undefined!' ));
                        }

                        log.trace( 'Player Updated', player[1].text, player[8].text, player[2].text, refRating );
                        refRating.push( rating, function( error ) {
                            if ( error ) {
                                log.trace( 'Error', error );
                                reject( new Error( error ) );
                            } else {
                                log.trace( 'Success', player[1].text, player[8].text, player[2].text );
                            }
                        });
                    } catch ( error ) {
                        reject( new Error( error ) );
                    }
                }
            } ).on( 'end', function() {
                fulfill( fileName );
            } );
        } );
    }

    /**
     * A query wrapper for returning a list of ratings order by {country}, {title}, {age}, {asc/desc}
     * @callback query
     * @param { string } child
     * @param { number } limit
     */
    query( child, limit ) {

        const that = this;
        const ref = that.db.ref( 'players' );
        let items = [];

        return new Promise( function( fulfill, reject ) {
            if ( typeof child === 'string' && typeof limit === 'number' ) {
                ref.orderByChild( child ).limitToLast( limit ).once( 'value', function( snapshot ) {
                    snapshot.forEach(function( childSnapshot ) {
                        items.push( childSnapshot.val() );
                    } );
                } ).then( function() {
                    fulfill( items.reverse() );
                }, function( error ) {
                    reject( new Error( error ) );
                } );

            } else {
                reject( new Error('Parameters passed are not of valid types') );
            }
        });
    }

    /**
     * Returns a JSON object for an individual player.
     * @callback playerById
     * @param { number } id
     */
    playerById( id ) {

        const that = this;
        const ref = that.db.ref( 'players/' + id );
        let player;

        return new Promise( function( fulfill, reject ) {
            ref.once( 'value', function( snapshot ) {
                player = snapshot.val();
            }, function( error ) {
                reject( new Error( error ) );
            } ).then( function() {
                fulfill( player );
            });
        });

    }
}

module.exports = FirebasePlayerService;
