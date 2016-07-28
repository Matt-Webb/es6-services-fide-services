'use strict';

const config = require( './config/app' );
const ScheduleService = require( './modules/schedule.service' );


// define a schedule passing in the cron string (or object literal syntax { minute: 1, hour: 8 } etc):
const schedule = new ScheduleService( config );

// Schedule task
let scheduleJob = function() {
    console.log('Running!');
};

// start schedule
schedule.start( scheduleJob );

// quit schedule
//schedule.stop( /* optional callback */ );
