const request = require( 'request' );
const Converter = require( "csvtojson" ).Converter;
const converter = new Converter( {} );
const log = require( './general/logger.service' );
const config = require( '../config/app' );
const playerService = require( './baku.team.service' );


// gets the id from the csv data string:
function getPlayer( record ) {

    let id = record.split( '\t' )[ 4 ];

    if ( typeof id !== undefined || typeof id === 'Number' ) {

        return new Promise( ( fulfill, reject ) => {

            playerService( id ).then( data => {
                let player = JSON.parse( data )[ 0 ];
                fulfill( player._id );
            } );
        } );
    }
};

function getAllPlayers( team ) {

    return new Promise( ( fulfill, reject ) => {

        let openSection = [];

        for ( let i = 1; i <= 10; i++ ) {

            let type = 'Open'
            let index = i;

            if( i > 5 ) {
                type = 'Women';
                index = index - 5;
            }

            getPlayer( team[ type + ' player ' + index ] ).then( id => {
                console.log('Adding ' + type + ' id to array', id );
                if( type === 'Open' ) {
                    openSection.push( id );
                }
                if( type === 'Women') {
                    womenSection.push( id );
                }

                if( i === 10 ) {
                    console.log( 'fulfilling promise!' );
                    fulfill( {
                        open: openSection,
                        women: womenSection
                    });
                }
            } );
        };


    } );
}

//end_parsed will be emitted once parsing finished
converter.on( "end_parsed", function ( jsonArray ) {

    let counter = 0;

    jsonArray.forEach( team => {

        if ( counter >= 1 ) return;

        getAllPlayers( team ).then( data => {

            let options = {
                url: config.db.mongo.api + '/teams',
                method: 'POST',
                json: true,
                body: {
                    team: {
                        name: team.Name,
                        country: team[ 'Country of Residence' ],
                        openPlayers: data.open,
                        womenPlayers: data.women
                    }
                }
            };

            request.post( options, ( err, res, body ) => {
                if ( !err && res.statusCode === 200 ) {
                    log.trace( 'Team added!' );
                } else {
                    log.error( err );
                }
            } );

        }, function ( error ) {
            console.log( error );
        } );

        counter++;

    } );

} );


converter.fromFile( "../data/formidable_entries.csv", function ( err, result ) {
    if ( err ) {
        log.error( 'Something went wrong!', err );
    }
} );
