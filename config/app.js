'use strict';

module.exports = {
    db: {
        firebase: {
            url: 'https://myrating.firebaseio.com/'
        },
        fide: {
            url: 'http://ratings.fide.com/download/players_list.zip',
            folder: './data',
            txtFile: 'players_list_foa.txt'
        }
    }
};
