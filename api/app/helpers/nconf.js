var path = require('path'),
  nconf = require('nconf');

/**
 * Setup nconf to use (in-order):
 *   1. Command-line arguments
 *   2. Environment variables
 *   3. A file located at '../../config/env.json'
 *   4. A file located at '../../config/credentials.json'
 *   5. A file located at '../../config/domain-logic.json'
 */
nconf.argv()
  .env()
  .file( { file: path.join ( __dirname, '../../config/env.json' ) } );

nconf.add('domain-logic', { type: 'file', file: path.join( __dirname, '../../config/domain-logic.json' ) } );
nconf.add('credentials', { type: 'file', file: path.join( __dirname, '../../config/credentials.json' ) } );

module.exports = nconf;
