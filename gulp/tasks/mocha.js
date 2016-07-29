/**
 * This task starts Mocha
 */

'use strict';

var gulp = require( 'gulp' );
var mocha = require( 'gulp-mocha' );

module.exports = function ( name, dependency, config ) {
    gulp.task( name, dependency, function () {
    	return gulp.src( './spec/index-spec.js', { read: false } )
    		// gulp-mocha needs filepaths so you can't have any plugins before it
    		.pipe( mocha() );
    });
};
