var fs    = require('fs'),
    path  = require('path'),
    nconf = require('nconf');

nconf.argv()
    .env()
    .file({ file: path.join(__dirname, '../config.json') });

module.exports = nconf;
