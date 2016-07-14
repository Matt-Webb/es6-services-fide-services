'use strict';
const firebase = require('firebase');
const fs = require('fs');
const readline = require('readline');
const stream = require('stream');
const bigXml = require('big-xml');

class FirebasePlayerService {

    constructor(properties) {
        this.properties = properties;
        this.firebase = firebase.initializeApp({
            databaseURL: properties.db.firebase.databaseURL,
            serviceAccount: properties.db.firebase.serviceAccount
        });
        this.db = this.firebase.database();
    }

    updateAll() {

        const reader = bigXml.createReader(this.properties.db.fide.folder + this.properties.db.fide.xmlFile, /^(player)$/, {
            gzip: false
        });

        const ref = this.db.ref('players');

        return new Promise(function(fulfill, reject) {

            reader.on('record', function(record) {

                    let p = record.children;
                    let player = {};

                    // below we create a dynamic key using an object literal obj['name'], this allows use to use
                    // the fide id as the firebase reference id.
                    player[p[0].text] = {
                        id: parseInt(p[0].text, 10) || null,
                        name: p[1].text || null,
                        country: p[2].text || null,
                        sex: p[3].text || null,
                        title: p[4].text || null,
                        womens_title: p[5].text || null,
                        online_title: p[6].text || null,
                        foa_title: p[7].text || null,
                        rating: parseInt(p[8].text, 10) || null,
                        games: parseInt(p[9].text) || null,
                        k_factor: parseInt(p[10].text, 10) || null,
                        birth_year: parseInt(p[11].text, 10) || null,
                        flag: p[12].text || null
                    };

                    try {
                        if (player[p[0].text].rating !== null && player[p[0].text].name !== null && player[p[0].text].country === 'ENG') {
                            ref.update(player, function(error) {
                                if (error) {
                                    console.log('An error occurred', error);
                                }
                            });
                        }
                    } catch (error) {
                        console.log('try catch error', error);
                    }
                })
                .on('end', function() {
                    console.log('FINISHED!');
                    fulfill('Complete!');
                });
        });
    }

    query(child, limit) {

        let ref = this.db.ref('players');
        let items = [];

        return new Promise(function(fulfill, reject) {
            if (typeof child === 'string' && typeof limit === 'number') {
                ref.orderByChild(child).limitToLast(limit).once("value", function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                        items.push(childSnapshot.val());
                    });
                }).then(function() {
                    fulfill(items.reverse());
                }, function(error) {
                    reject(new Error(error));
                });

            } else {
                reject(new Error('Parameters passed are not of valid types'));
            }
        });
    }
}

module.exports = FirebasePlayerService;
