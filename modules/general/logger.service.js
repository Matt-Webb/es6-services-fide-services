'use strict';

const log4js = require( 'log4js' );
const config = require( '../../config/app.json' );

log4js.configure( config.logger );

const logger = log4js.getLogger( 'app' );

module.exports = logger;
