'use strict';

const http = require('http');
const fs = require('fs');
const AdmZip = require('adm-zip');
const log = require('./logger.service');

class FidePlayerService {

    constructor(properties) {
        this.properties = properties;
        this.fide = properties.db.fide;
    }

    /**
     * This method does a http GET request to the fide download page for a zip XML data file.
     * @return {promise}
     * @param {string} fileName
     */
    download(fileName) {
        log.trace('Initialised Download', fileName);
        const that = this;
        return new Promise(function(fulfill, reject) {
            try {
                let file = fs.createWriteStream(that.fide.folder + '/' + fileName);
                log.trace('Executing HTTP GET', that.fide.url);
                http.get(that.fide.url, function(response) {
                    response.pipe(file);
                    log.trace('Successful response.');
                    file.on('finish', function() {
                        file.close();
                        fulfill(fileName);
                    });
                }).on('error', function(error) {
                    fs.unlink(that.fide.folder);
                    log.error('Error on HTTP GET', error);
                    reject(new Error(error));
                });
            } catch (error) {
                log.error('Unexpected Error', error);
                reject(new Error(error));
            }
        });
    }

    /**
     * This method takes a .zip file and unzips it to the same folder.
     * @return {promise}
     * @param {string} file
     */
    extract(file) {
        log.trace('Extracting XML file from Zip', file);
        const that = this;
        return new Promise(function(fulfill, reject) {

            if (file.indexOf('.zip') === -1) {
                reject(new Error('File must be stored as a .zip'));
            }

            let zip = new AdmZip(that.fide.folder + '/' + file);
            let zipEntries = zip.getEntries();

            zipEntries.forEach(function(zipEntry) {
                if (zipEntry.entryName === that.fide.xmlFile) {
                    try {
                        zip.extractEntryTo(that.fide.xmlFile, that.fide.folder, false, true);
                        log.trace('Extract complete.');
                        fulfill('Extract complete.');
                    } catch (error) {
                        log.trace('Error', error);
                        reject(new Error(error));
                    }
                } else {
                    log.trace('Error Unable to match file');
                    reject(new Error('Unable to match file'));
                }
            });
        });
    }
}

module.exports = FidePlayerService;
