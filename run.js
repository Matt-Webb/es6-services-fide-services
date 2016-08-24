const service = require( './main' )();
const config = require( './config/app' );
const log = require( './modules/general/logger.service' );


// 1. get downloaded player:
service.startProcess()
    .then( service.download )
    .then( service.extract )
    .then( service.createPlayerJson )
    .then( service.finish, service.error );


// 2. Extract players

// 3. Create Json File:

// 4. Get Baku Players (MEN and WOMEN)

// 5. Compare Open Players

// 6. Put players into Mongo!
