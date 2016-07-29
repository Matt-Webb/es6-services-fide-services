'use strict';

var gulp = require( 'gulp' );
var exec = require( 'child_process' ).exec;

module.exports = function( name, dependancy, config ) {
    gulp.task( name, function( callback ) {
        exec( 'node ' + config.file, function( err, stdout, stderr ) {
            if ( err ) {
                throw err;
            } else {
                console.log( 'process restarted.', stdout, stderr );
            }
        });

    })
}
