# Chess Player - Rating Manager

The aim of this project is to import the `FIDE` rated player list into a `Firebase` database _(500k+ records)_. This will provide a configurable schedule for recursive downloads, a historic record will be kept to monitor existing player ratings all held within `Firebase`.

**note** This project is still under active development and is current _unstable_ if you would like to contribute to this project, please contact me at matt.d.webb [@] icloud.com.

This project is created with the following coding standards

## SERVER SIDE

### Schedule

Reference the Schedule Service:
```
const ScheduleService = require( './modules/schedule.service' );
```

Instantiate instance of Schedule (passing in the appropriate config):
```
const schedule = new ScheduleService( config );
```

Example Config:
```
{ cron : "/1 * * * * *" }
```

Start your schedule:
```
schedule.start( scheduleJob );
```

Terminate your schedule:
```
schedule.stop( /* optional callback */ );
```

### Download

Instantiate instance of the Fide Player Service:
```
const Players = new FidePlayerService(config);
```

To elegantly handle the download and extract, wrap your service calls in a function:
```
function download(file) {
    return Players.download(file);
}
function extract(file) {
    return Players.extract(file);
}
```

All external service methods are handle using `ES6 Promises` where you can pass a callback function on success or fail:
```
download().then(extract).then(success,error);
```

### FirebaseDb

A defined list of methods have been written as a wrapper around the `Firebase API`, this enable a clean and readable set of functions to be called.
Examples:
```
const FirebaseDb = new FirebaseService(config);
```

#### playerById
```
playerById(418250).then(function(data) {
    console.log('Player returned:' + data.name);
}, error);
```
