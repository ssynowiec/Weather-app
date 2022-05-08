const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const clean = require('gulp-clean');
const kit = require('gulp-kit');
const paths = {
	dist: './dist',
	html: './html/**/*.kit',
	sass: './src/sass/**/*.scss',
	sassDest: './dist/css',
	js: './src/js/**/*.js',
	jsDest: './dist/js',
	img: './src/img/*',
	imgDest: './dist/img',
};
function buildStyles(done) {
	src(paths.sass)
		.pipe(sourcemaps.init())
		// .pipe(sourcemaps.identityMap())
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(cssnano())
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write())
		// .pipe(rename({ extname: '.css.map' }))
		.pipe(dest(paths.sassDest));
	done();
}
function buildScripts(done) {
	src(paths.js)
		.pipe(sourcemaps.init())
		.pipe(babel({ presets: ['@babel/env'] }))
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write())
		.pipe(dest(paths.jsDest));
	done();
}
function convertImages(done) {
	src(paths.img).pipe(imagemin()).pipe(dest(paths.imgDest));
	done();
}
function handleKits(done) {
	src(paths.html).pipe(kit()).pipe(dest('./'));
	done();
}
function cleanStuff(done) {
	src(paths.dist, { read: false }).pipe(clean());
	done();
}
function startBroweserSync(done) {
	browserSync.init({
		server: {
			baseDir: './',
		},
	});
	done();
}
function watchForChanges(done) {
	watch('./*.html').on('change', reload);
	watch(paths.html, handleKits);
	watch(paths.sass, buildStyles).on('change', reload);
	watch(paths.js, buildScripts).on('change', reload);
	watch(paths.img, convertImages).on('change', reload);
	done();
}
const main = series(
	parallel(handleKits, buildStyles, buildScripts, convertImages),
	startBroweserSync,
	watchForChanges,
);
exports.default = main;
exports.clean = cleanStuff;
