# Chess Player - Rating Manager

The aim of this project is to import the `FIDE` rated player list into a `Firebase` database _(500k+ records)_. This will provide a configurable schedule for recursive downloads, a historic record will be kept to monitor existing player ratings all held within `Firebase`.

This project is created with the following coding standar

## SERVER SIDE

### Schedule

### Download

```
// instantiate instance of the Fide Player Service:
const Players = new FidePlayerService(config);
```

```
// to elegantly handle the download and extract,
// wrap your calls to each service method in a function:

function download(file) {
    return Players.download(file);
}

function extract(file) {
    return Players.extract(file);
}
```

All external service methods are handle using `ES6 Promises` where you can pass a callback function on success or fail:
```
download().then(extract).then(function() {
    console.log('download + extract completed successfully!');
}, function(error) {
    console.log('An error occurred', error);
});
```

### FirebaseDb

A defined list of methods have been written as a wrapper around the `Firebase API`, this enable a clean and readable set of functions to be called. Examples:

```
const FirebaseDb = new FirebaseService(config);
```

#### playerById

```
playerById(418250).then(function(data) {
    console.log('Player returned:' + data.name);
}, error);
```

## CLIENT SIDE

### Individual records
