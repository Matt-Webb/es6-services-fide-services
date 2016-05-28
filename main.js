'use strict';
//core

const config = require('./config/app');
const firebase = require('firebase');
const ratingDb = new Firebase(config.db.firebase.url);
const FidePlayerService = require('./modules/player.service');
const Players = new FidePlayerService(config);

const fideZipUrl = config.db.fide.url;


function download() {
    return Players.download();
}

function extract() {
    return Players.extract('players-040516.zip');
}

function success() {
    console.log('done');
}

download().then(function(data){
    console.log(data);
}, function(err) {
    console.log(err);
});
