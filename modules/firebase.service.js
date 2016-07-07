'use strict';

const config = require('./config/app');
const firebase = require('firebase');
const ratingDb = new Firebase(config.db.firebase.url);
