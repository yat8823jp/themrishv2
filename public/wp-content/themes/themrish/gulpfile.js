/*
 * Global variables
 */
const gulp           = require( 'gulp' ),
	postcss          = require( 'gulp-postcss' ),
	autoprefixer     = require( 'autoprefixer' ),
	stylelint        = require( 'stylelint' ),
	bulkSass         = require( 'gulp-sass-bulk-import' ),
	sass             = require( 'gulp-sass' )( require( 'sass' ) ),
	sassGlob         = require( 'gulp-sass-glob-use-forward' ),
	browserSync      = require( 'browser-sync' ),//ブラウザシンク
	plumber          = require( 'gulp-plumber' ),//エラー通知
	notify           = require( 'gulp-notify' ),//エラー通知
	pleeease         = require( 'gulp-pleeease' ),//ベンダープレフィックス
	vinyl_source     = require( 'vinyl-source-stream' ),
	buffer           = require( 'vinyl-buffer' ),
	browserify       = require( 'browserify' ),
	babelify         = require( 'babelify' ),
	browserifyShim   = require( 'browserify-shim' ),
	watchify         = require( 'watchify' ),
	useref           = require( 'gulp-useref' ),//ファイル結合
	gulpif           = require( 'gulp-if' ),// if文
	uglify           = require( 'gulp-uglify' ),//js圧縮
	rename           = require( 'gulp-rename' ),
	minifyCss        = require( 'gulp-cssnano' ),//css圧縮
	del              = require( 'del' ),//ディレクトリ削除
	fs               = require( "graceful-fs" ),
	data             = require( 'gulp-data' ), //json-data
	sourcemaps       = require( 'gulp-sourcemaps' ),
	debug            = require( 'gulp-debug' ),
	util             = require( 'gulp-util' ),
	path             = require( 'path' ), //path
	minimist         = require( 'minimist' ),
	fractal          = require( '@frctl/fractal' ).create();

	const paths = {
		rootDir   : '/',
		dstrootDir: 'htdocs',
		srcDir    : '/images',
		dstDir    : 'htdocs/images',
		serverDir : 'localhost',
		styleguide: 'css/guid'
	};

	const options = minimist( process.argv.slice( 2 ), {
		string: 'path',
		default: {
			path: 'themrish.local' // 引数の初期値
		}
	});

	fractal.set( 'project.title', 'themrish' );
	fractal.components.set( 'path', './src/styleguide/components/' );
	fractal.docs.set('path', './src/styleguide/docs' );
	fractal.web.set( 'static.path', './htdocs/assets' );
	fractal.web.set( 'builder.dest', './styleguide' );
	const logger = fractal.cli.console;
/*
 * Sass
 */
gulp.task( 'sass', function( done ) {
	gulp.src( './src/styles/**/*.scss' )
		.pipe( sassGlob() )
		.pipe( sass.sync().on( 'error', sass.logError ) )
		.pipe( sourcemaps.init() )
		.pipe( sass( {
			outputStyle: 'expanded',
			minifier: true //圧縮の有無 true/false
		} ) )
		.pipe( postcss( [
			autoprefixer( {
				grid: true,
				cascade: false
			} )
		] ) )
		.pipe( rename( {
			sass: true
		} ) )
		.pipe( sourcemaps.write( './' ) )
		.pipe( gulp.dest( './' ) )
		.pipe( gulp.dest( './' ) );
	done();
});


/*
 * Style Guide
 */
gulp.task( 'styleguide', function() {
	const builder = fractal.web.builder();
	// 出力中のconsole表示設定
	builder.on( 'progress', function( completed, total ) {
	logger.update( `${total} 件中 ${completed} 件目を出力中...`, 'info' );
} );

// 出力失敗時のconsole表示設定
	builder.on( 'error', function() {
		logger.error( err.message );
	});

	// 出力処理を実行
	return builder.build().then( function() {
		logger.success( 'スタイルガイドの出力処理が完了しました。' );
	});
});


/*
 * JavaScript
 */
gulp.task( 'browserify', function ( done ) {
	const option = {
		bundleOption: {
			cache: {}, packageCache: {}, fullPaths: false,
			debug: true,
			entries: './src/scripts/main.js',
			extensions: [ 'js' ]
		},
		dest: './js',
		filename: 'bundle.js'
	};
	const b = browserify ( option.bundleOption )
		.transform( babelify.configure ( {
			compact: false,
			presets: ['@babel/preset-env']
		} ) )
		.transform( browserifyShim );
		bundle = function () {
		b.bundle()
			.pipe( plumber ( {
				errorHandler: notify.onError( 'Error: <%= error.message %>' )
			} ) )
			.pipe( vinyl_source ( option.filename ) )
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
gulp.task( 'pleeease', function() {
	return gulp.src( './style.css' )
		.pipe( pleeease( {
			sass: true,
			minifier: true //圧縮の有無 true/false
		} ) )
		.pipe( postcss ( [
			autoprefixer( {
				cascade: false,
				grid: "autoplace"
			} )
		] ) )
		.pipe( plumber ( {
			errorHandler: notify.onError( 'Error: <%= error.message %>' )
		} ) )
		.pipe( gulp.dest( './' ) );
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
			target: options.path
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
		'./**/*.scss',
		'./**/*._scss',
		'./**/*.png',
		'./**/*.jpg',
		'./**/*.svg'
	];
	gulp.watch( './src/styles/**/*.scss', gulp.task( 'sass' ) );
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
		gulp.parallel( 'html', 'devcopy' )
	)
);
