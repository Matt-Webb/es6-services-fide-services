/**
 * This task uses jscs to check if the coding standards are matched
 *
 * uses the following parameters:
 *     config.src {Array}
 */

'use strict';

var gulp = require( 'gulp' );
var jscs = require( 'gulp-jscs' );

module.exports = function( name, dependency, config ) {
    gulp.task( name, dependency, function() {
        return gulp.src( config.src )
            .pipe( jscs() );
    } );
};
