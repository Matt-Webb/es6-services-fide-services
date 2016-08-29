const request = require( 'request' );
const Converter = require( "csvtojson" ).Converter;
const converter = new Converter( {} );
const log = require( './general/logger.service' );

//end_parsed will be emitted once parsing finished
converter.on( "end_parsed", function ( jsonArray ) {

    jsonArray.forEach( team => {

        let options = {
            url: config.db.mongo.api + '/teams',
            method: 'POST',
            json: true,
            body: {
                team: {
                    name: team.Name,
                    userId: team['User ID'],
                    country: team['Country of Residence'],
                    openOne: '',
                    openTwo: '',
                    openThree: '',
                    openFour: '',
                    
                }
            }
        };

        request.post( options, ( err, res, body ) => {
            if ( !err && res.statusCode === 200 ) {
                log.trace( 'Player added!', body.player.name );
            } else {
                log.trace( err );
            }
        } );


    });

} );


converter.fromFile( "../data/test-form-data.csv", function ( err, result ) {
    if ( err ) {
        log.error( 'Something went wrong!', err );
    }
} );
