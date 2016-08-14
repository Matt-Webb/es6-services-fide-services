'use strict';

var runSequence = require( 'run-sequence' );

module.exports = ( function() {
    var url = require( 'url' );
    var fs = require( 'fs' );

    var base = {
        src: './src',
        build: './tmp',
        dist: './dist',
    };

    return {
        tasks: {
            'run-code' : {
                taskname: 'run',
                file: './server.js',
            },
            'lint-scripts': {
                taskname: 'jshint',
                src: [ './main.js', './server.js', './modules/**/*.js', './test/**/*.js' ]
            },
            'lint-code-standards': {
                taskname: 'jscs',
                src: [ './main.js', './server.js', './modules/**/*.js', './test/**/*.js' ]
            },
            'run-unit-tests': {
                taskname: 'mocha'
            }
        },
        commands: {
            'test': function runCommand( callback ) {
                runSequence( [
                    'lint-scripts',
                    'lint-code-standards'
                ], [
                    'run-unit-tests'
                ], callback );
            },
            'start': function runCommand( callback ) {
                runSequence(
                // [
                //     // 'lint-scripts',
                //     // 'lint-code-standards'
                // ],
                [
                    'run-code'
                ], callback );
            }
        }
    };

}() );
