'use strict';

const http = require('http');
const fs = require('fs');
const AdmZip = require('adm-zip');
const moment = require('moment');
let fileName = 'data/players-' + moment().format('DDMMYY') + '.zip';

class FidePlayerService {

    constructor(properties) {
        this.properties = properties;
    }

    download() {
        console.log('download service initialised');
        let fide = this.properties.db.fide;

        return new Promise(function(fulfill, reject) {
            try {
                let file = fs.createWriteStream('./data/test');
                let request = http.get(fide.url, function(response) {
                    response.pipe(fileName);
                    file.on('finish', function() {
                        file.close(cb); // close() is async, call cb after close completes.
                        fulfill('sucesss');
                    });
                }).on('error', function(err) { // Handle errors
                    console.log('error occured');
                    fs.unlink(fide.folder); // Delete the file async. (But we don't check the result)
                    if (cb) cb(err.message);
                    reject(err);
                });
            } catch (err) {
                reject(new Error(err));
            }


        });
    }

    extract(file) {
        console.log('extract service initialised');
        let fide = this.properties.db.fide;

        return new Promise(function(fulfill, reject) {

            if (file.indexOf('.zip') === -1) {
                reject(new Error('File must be stored as a .zip'));
            }

            let zip = new AdmZip(fide.folder + file);
            let zipEntries = zip.getEntries();

            zipEntries.forEach(function(zipEntry) {
                if (zipEntry.entryName === fide.txtFile) {
                    try {
                        zip.extractEntryTo(fide.txtFile, fide.folder, false, true);
                        fulfill('File extracted successfully');
                    } catch (err) {
                        reject(new Error(err));
                    }
                } else {
                    reject(new Error('Unable to match file'));
                }
            });
        });
    }

}

module.exports = FidePlayerService
