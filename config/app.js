'use strict';

module.exports = {
    db: {
        firebase: {
            databaseURL: 'https://myrating.firebaseio.com/',
            serviceAccount: './secure/mychessrating-35b25418f350.json'
        },
        fide: {
            url: 'http://ratings.fide.com/download/players_list_xml.zip',
            folder: './data/',
            xmlFile: 'players_list_xml_foa.xml'
        }
    }
};
