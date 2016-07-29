/**
 * This task uses jshit to lint the javascript code described
 * in the configuraiton
 *
 * uses the following parameters:
 *     config.src {Array}
 */

'use strict';

var gulp = require( 'gulp' );
var jshint = require( 'gulp-jshint' );

module.exports = function ( name, dependency, config ) {
    gulp.task( name, dependency, function () {
        return gulp.src( config.src )
            .pipe( jshint() )
            .pipe( jshint.reporter( 'default' ) )
            .pipe( jshint.reporter( 'fail' ) );
    } );
};
