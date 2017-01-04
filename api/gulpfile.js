'use strict';

const gulp = require( 'gulp' );
const path = require( 'path' );
const eslint = require( 'gulp-eslint' );
const cache = require( 'gulp-cached' );
const gulpIf = require( 'gulp-if' );

function isFixed( file ) {
	// Has ESLint fixed the file contents?
  return file.eslint != null && file.eslint.fixed;
}

gulp.task( 'lint-n-fix', () => {

  return gulp.src( 'app/**/*.js' )
		.pipe( eslint({
  fix: true
}) )
		.pipe( eslint.format() )
		// if fixed, write the file to dest
		.pipe( gulpIf( isFixed, gulp.dest( 'app/' ) ) );
});

gulp.task( 'flag-n-fix', () => {
	// This is a *very* basic CLI flag check.
	// For a more robust method, check out [yargs](https://www.npmjs.com/package/yargs)
  const hasFixFlag = ( process.argv.slice( 2 ).indexOf( '--fix' ) >= 0 );

  return gulp.src( 'app/**/*.js' )
		.pipe( eslint({
  fix: hasFixFlag
}) )
		.pipe( eslint.format() )
		// if fixed, write the file to dest
		.pipe( gulpIf( isFixed, gulp.dest( 'app/' ) ) );
});


gulp.task( 'lint-watch', () => {
	// Lint only files that change after this watch starts
  const lintAndPrint = eslint();
	// format results with each file, since this stream won't end.
  lintAndPrint.pipe( eslint.formatEach() );

  return gulp.watch( './app/**/*.js', event => {
    if ( event.type !== 'deleted' ) {
      gulp.src( event.path )
				.pipe( lintAndPrint, {end: false});
    }
  });
});



gulp.task( 'cached-lint', () => {
	// Read all js files within test/fixtures
  return gulp.src( './app/**/*.js' )
		.pipe( cache( 'eslint' ) )
		// Only uncached and changed files past this point
		.pipe( eslint() )
		.pipe( eslint.format() )
		.pipe( eslint.result( result => {
  if ( result.warningCount > 0 || result.errorCount > 0 ) {
				// If a file has errors/warnings remove uncache it
    delete cache.caches.eslint[path.resolve( result.filePath )];
  }
}) );
});

// Run the "cached-lint" task initially...
gulp.task( 'cached-lint-watch', ['cached-lint'], () => {
	// ...and whenever a watched file changes
  return gulp.watch( './app/**/*.js', ['cached-lint'], event => {
    if ( event.type === 'deleted' && cache.caches.eslint ) {
			// remove deleted files from cache
      delete cache.caches.eslint[event.path];
    }
  });
});

gulp.task( 'default', ['cached-lint-watch', 'lint-n-fix'] );
