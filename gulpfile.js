/**
 * This file will load all the gulp tasks defined in the config.js file
 */

'use strict';

var config = require( './gulp/config' );
var gulp = require( 'gulp' );

if ( config && config.tasks ) {
    for ( var task in config.tasks ) {
        if ( config.tasks.hasOwnProperty( task ) ) {
            require( './gulp/tasks/' + config.tasks[ task ].taskname )
            ( task, config.tasks[ task ].dependency || [], config.tasks[ task ] );
        }
    }

    for ( var command in config.commands ) {
        if ( config.commands.hasOwnProperty( command ) ) {
            gulp.task( command, config.commands[ command ] );
        }
    }
}
