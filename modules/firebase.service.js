'use strict';
const firebase = require('firebase');
const fs = require('fs');
const readline = require('readline');
const stream = require('stream');

firebase.initializeApp({
  databaseURL: "https://mychessrating.firebaseio.com/",
  serviceAccount: "./secure/mychessrating-35b25418f350.json"
});

const db = firebase.database();
const ref = db.ref("players");


let instream = fs.createReadStream('./data/players_list_foa.txt');
let outstream = new stream;
outstream.readable = true;

let rl = readline.createInterface({
    input: instream,
})

// examples:
ref.set({
    '1234' : {
        name: 'Matthew D Webb',
        grade: 237,
        age: 29,
    },
    '1235' : {
        name: 'Ihor Lewyk',
        grade: 180,
        age: 52
    }
}, function(error) {
    if(error) {
        console.log('Something bad happened!');
    } else {
        console.log('everything saved successfully');
    }

});

// read:
ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});
