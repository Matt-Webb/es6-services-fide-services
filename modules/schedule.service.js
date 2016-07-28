'use strict';

const schedule = require( 'node-schedule' );
const log = require( './logger.service' );

class ScheduleService {

    constructor ( config ) {
        this.cron = config.cron;
        this.job = null;
    }

    start ( callback ) {
        if ( this.cron ) {

            log.trace( 'Starting Schedule Service', this.cron );

            this.job = schedule.scheduleJob( this.cron, function() {
                callback();
            } );

        } else {

            throw new Error( 'No config cron settings provided!' );

        }
    }

    stop ( callback ) {
        if ( this.job ) {

            log.trace( 'Stopping Schedule Service', this.job );

            this.job.cancel();

            if ( callback ) {
                callback();
            }

        }
    }
}

module.exports = ReportSchedule;
