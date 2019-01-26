/*
 * Global variables
 */
var gulp = require( 'gulp' ),
	bulkSass = require( 'gulp-sass-bulk-import' ),
	scss = require( 'gulp-sass' ),
	browserSync = require( 'browser-sync' ),//ブラウザシンク
	plumber = require( 'gulp-plumber' ),//エラー通知
	notify = require( 'gulp-notify' ),//エラー通知
	imagemin = require( 'gulp-imagemin' ),//画像圧縮
	imageminPngquant = require( 'imagemin-pngquant' ),//png画像の圧縮
	pleeease = require( 'gulp-pleeease' ),//ベンダープレフィックス
	source = require( 'vinyl-source-stream' ),
	buffer = require( 'vinyl-buffer' ),
	browserify = require( 'browserify' ),
	babelify = require ( 'babelify' ),
	browserifyShim = require( 'browserify-shim' ),
	watchify = require( 'watchify' ),
	useref = require( 'gulp-useref' ),//ファイル結合
	gulpif = require( 'gulp-if' ),// if文
	uglify = require( 'gulp-uglify' ),//js圧縮
	rename = require( 'gulp-rename' ),
	minifyCss = require( 'gulp-cssnano' ),//css圧縮
	del = require( 'del' ),//ディレクトリ削除
	fs = require( "fs" ),
	data = require( 'gulp-data' ), //json-data
	sourcemaps = require( 'gulp-sourcemaps' ),
	debug = require( 'gulp-debug' ),
	util = require( 'gulp-util' ),
	path = require('path'), //path
	paths = {
		rootDir : '/',
		dstrootDir : 'htdocs',
		srcDir : '/images',
		dstDir : 'htdocs/images',
		serverDir : 'localhost'
	};
/*
 * Sass
 */
gulp.task( 'scss', function( done ) {
	gulp.src( './src/styles/**/*.scss' )
		.pipe( plumber ( {
			errorHandler: notify.onError( 'Error: <%= error.message %>' )
		} ) )
		.pipe( sourcemaps.init() )
		.pipe( bulkSass() )
		.pipe( rename( {
			sass: true,
			minifier: false //圧縮の有無 true/false
		} ) )
		.pipe( scss( {
			outputStyle: 'expanded'
		} ) )
		.pipe( sourcemaps.write( './' ) )
		.pipe( gulp.dest( './' ) );
	done();
});

/*
 * JavaScript
 */

gulp.task( 'browserify', function ( done ) {
	var option = {
		bundleOption: {
			cache: {}, packageCache: {}, fullPaths: false,
			debug: true,
			entries: './src/scripts/main.js',
			extensions: [ 'js' ]
		},
		dest: './js',
		filename: 'bundle.js'
	};
	var b = browserify ( option.bundleOption )
		.transform( babelify.configure ( {
			compact: false,
			presets: ["es2015"]
		} ) )
		.transform( browserifyShim );
	bundle = function () {
		b.bundle()
			.pipe( plumber ( {
				errorHandler: notify.onError( 'Error: <%= error.message %>' )
			} ) )
			.pipe( source ( option.filename ) )
			.pipe( gulp.dest ( option.dest ) );
	};
	if ( global.isWatching ) {
		var bundler = watchify( b );
		bundler.on( 'update', bundle );
	}
	done();
	return bundle();
});

/*
 * Pleeease
 */
gulp.task( 'pleeease', function( done ) {
	return gulp.src( './style.css' )
		.pipe( pleeease( {
			sass: true,
			minifier: false //圧縮の有無 true/false
		} ) )
		.pipe( plumber ( {
			errorHandler: notify.onError( 'Error: <%= error.message %>' )
		} ) )
		.pipe( gulp.dest( './' ) );
	done();
});

/*
 * Imagemin
 */
gulp.task( 'imagemin', function( done ) {
	var srcGlob = paths.srcDir + '/**/*.+( jpg|jpeg|png|gif|svg|ico )';
	var dstGlob = paths.dstDir;
	var imageminOptions = {
		optimizationLevel: 7,
		use: imageminPngquant( { quality: '65-80', speed: 1 } )
	};

	gulp.src( srcGlob )
		.pipe( plumber ( {
			errorHandler: notify.onError( 'Error: <%= error.message %>' )
		} ) )
		.pipe( imagemin( imageminOptions ) )
		.pipe( gulp.dest( paths.dstDir ) );
	done();
});

/*
 * Useref
 */
gulp.task( 'html', function ( done ) {
	return gulp.src( './**/*.+( html|php )' )
		.pipe( useref( { searchPath: [ '.', 'dev' ] } ) )
		.pipe( gulpif( '*.js', uglify() ) )
		.pipe( gulpif( '*.css', minifyCss() ) )
		.pipe( gulp.dest( paths.dstrootDir ) );
	done();
});


/*
 * Browser-sync
 */
gulp.task( 'browser-sync', function( done ) {
	browserSync.init({
		// server: {
		// 	baseDir: paths.rootDir,
		// 	routes: {
		// 		"/node_modules": "node_modules"
		// 	}
		// },
		proxy: {
			target: "designfront.local"
		},
		notify: true
	});
	done();
});
gulp.task( 'bs-reload', function ( done ) {
	browserSync.reload();
	done();
});

gulp.task( 'setWatch', function ( done ) {
	global.isWatching = true;
	done();
});


/*
 * Default
 */
gulp.task( 'default', gulp.series( 'browser-sync', function() {
	var bsList = [
		'./**/*.html',
		'./**/*.php',
		'./js/**/*.js',
		'./style.css',
		'./**/*.png',
		'./**/*.jpg',
		'./**/*.svg'
	];
	gulp.watch( './src/styles/**/*.scss', gulp.task( 'scss' ) );
	gulp.watch( './src/scripts/**/*.js', gulp.task( 'browserify' ) );
	gulp.watch( bsList, gulp.task( 'bs-reload') );
}));

/*
 * Build
 */
gulp.task( 'clean', function( done ) {
	return del( [paths.dstrootDir] );
} );
gulp.task( 'devcopy', function ( done ) {
	return gulp.src([
		'./**/*.*',
		'!./src/**',
		'!./**/*.map',
		'!./gulp/**',
		'!./gulpfile.js',
		'!./package.json',
		'!./package-lock.json',
		'!./node_modules/**/*.*'

	], {
		dot: true
	}).pipe( gulp.dest( paths.dstrootDir ) );
	done();
});

gulp.task( 'build',
	gulp.series( 'clean',
		gulp.parallel( 'html', 'imagemin', 'devcopy' )
	)
);
