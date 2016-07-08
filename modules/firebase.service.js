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
            serviceAccount: properyies.db.firebase.serviceAccount
        });
        this.db = this.firebase.database();
    }

    updateAll() {

        const reader = bigXml.createReader(this.properties.folder + this.properties.xmlFire, /^(player)$/, {
            gzip: false
        });

        const ref = this.db.ref("players-test");

        return new Promise(function(fulfill, reject) {

                let counter = 0;

                reader.on('record', function(record) {

                    if (counter > 10) {
                        fulfill('complete');
                        return;
                    }

                    let p = record.children;
                    let player = {};

                    // below we create a dynamic key using an object literal obj['name'], this allows use to use
                    // the fide id as the firebase reference id.
                    player[p[0].text] = {
                        id: parseInt(p[0].text, 10) || "",
                        name: p[1].text || "",
                        country: p[2].text || "",
                        sex: p[3].text || "",
                        title: p[4].text || "",
                        w_title: p[5].text || "",
                        o_title: p[6].text || "",
                        foa_title: p[7].text || "",
                        rating: parseInt(p[8].text, 10) || "",
                        games: p[9].text || "",
                        k: parseInt(p[10].text, 10) || "",
                        birthday: parseInt(p[11].text, 10) || "",
                        flag: p[12].text || ""
                    };

                    if (player) {
                        try {
                            ref.update(player, function(error) {
                                if (error) {
                                    console.log('An error occurred', error);
                                } else {
                                    if (counter % 1000 === 0) {
                                        console.log('!---------------------- records:' + counter);
                                    }
                                    counter += 1;
                                }
                            });
                        } catch (e) {
                            console.log('try catch error', e);
                        }

                    } else {
                        console.log('Error, player has no name!');
                    }
                }).on('end', function() {
                    console.log('FINISHED!');
                    console.timeEnd();
                    fulfill('Complete!');
                });
            }
        }

        deleteRecord(id) {

        }
        updatePlayerById(id) {

        }
    }

    module.exports = FirebasePlayerService;
