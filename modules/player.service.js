'use strict';

const http = require('http');
const fs = require('fs');
const AdmZip = require('adm-zip');

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
        const that = this;
        return new Promise(function(fulfill, reject) {
            try {
                let file = fs.createWriteStream(that.fide.folder + '/' + fileName);
                http.get(that.fide.url, function(response) {
                    response.pipe(file);
                    file.on('finish', function() {
                        file.close();
                        fulfill(fileName);
                    });
                }).on('error', function(error) {
                    fs.unlink(that.fide.folder);
                    reject(new Error(error));
                });
            } catch (error) {
                reject(new Error(err));
            }
        });
    }

    /**
     * This method takes a .zip file and unzips it to the same folder.
     * @return {promise}
     * @param {string} file
     */
    extract(file) {
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
                        fulfill('Extract complete.');
                    } catch (error) {
                        reject(new Error(error));
                    }
                } else {
                    reject(new Error('Unable to match file'));
                }
            });
        });
    }
}

module.exports = FidePlayerService;
