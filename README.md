# Chess Player - Rating Manager

The aim of this project is to import the `FIDE` rated player list into multiple `Firebase` collections _(500k+ records)_. As each rating list is published, a configurable schedule for recursive downloads is provided, this enables a historic record to be kept to monitor new and existing ratings changes.

Beyond this each `Firebase` collection will be wrapped in a light weight API using the standard Firebase query conventions in order to retrieve player data.

In summary, this project should aid anyone who wishes to build an application for mobile & desktop allowing them to quickly and easily access official FIDE rated player data.

**Note** This project is under active development and is currently considered _unstable_ if you would like to contribute to this project, please contact me at matt.d.webb [@] icloud.com

### Project Details
    * JavaScript
        * ES6
        * Node Js
        * Common Js
        * Gulp

### Getting Started

Clone the repository
```
$ git clone https://github.com/Matt-Webb/firebase-es6-angular-fide-players.git
```

Install dependancies
```
$ npm install
```

Update config
    * Create your own Firebase Database
    * Add Firebase Credentials
    * Configure Schedule (see cron string settings)

Run Schedule
```
$ npm start
```

Run Tests
```
$ npm test
```  

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
