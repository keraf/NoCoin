const fs = require('fs');
const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const jeditor = require('gulp-json-editor');
const crx = require('gulp-crx-pack');
const zip = require('gulp-zip');
const del = require('del');
const runSequence = require('run-sequence');

const package = JSON.parse(fs.readFileSync('./package.json'));
const srcFolder = './src';
const buildFolder = './dist/tmp';
const babelConfig = {
    presets: ['env'],
    plugins: ['transform-object-rest-spread'],
}

// Clean old files
gulp.task('build:clean', () => {
    return del(`${buildFolder}/**/*`);
});

// Copy files to build folder
gulp.task('build:copy', () => {
    return gulp.src([
        `${srcFolder}/**/*`, 
        `!${srcFolder}/**/*.js`, 
        `!${srcFolder}/**/*.css`,
        `!${srcFolder}/manifest.json`])
        .pipe(gulp.dest(buildFolder));
});

// Transform the manifest
gulp.task('build:manifest', () => {
    return gulp.src(`${srcFolder}/manifest.json`)
        .pipe(jeditor({
            'version': package.version,
        }))
        .pipe(gulp.dest(buildFolder));
});

// Transform the JS files
gulp.task('build:js', () => {
    gulp.src([`${srcFolder}/js/background.js`, `${srcFolder}/js/popup.js`])
        .pipe(babel(babelConfig))
        .pipe(uglify())
        .pipe(gulp.dest(`${buildFolder}/js`));

    return gulp.src(`${srcFolder}/js/jquery.min.js`)
        .pipe(gulp.dest(`${buildFolder}/js`));
});

// Transform the CSS file
gulp.task('build:css', () => {
    return gulp.src(`${srcFolder}/styles/popup.css`)
        .pipe(cleanCSS())
        .pipe(gulp.dest(`${buildFolder}/styles`));
});

// Zip it for FF
gulp.task('pack:firefox', () => {
    return gulp.src(`${buildFolder}/**/*`)
        .pipe(zip(`nocoin-${package.version}.xpi`))
        .pipe(gulp.dest('./dist/firefox'));
});

// Zip it for Chrome
gulp.task('pack:chrome', () => {
    return gulp.src(`${buildFolder}/**/*`)
        .pipe(zip(`nocoin-${package.version}.zip`))
        .pipe(gulp.dest('./dist/chrome'));
});

// Make CRX
gulp.task('pack:chromium', () => {
    return gulp.src(`${buildFolder}`)
        .pipe(crx({
            privateKey: fs.readFileSync('./certs/key.pem', 'utf8'),
            filename: `nocoin-${package.version}.crx`,
            codebase: 'https://nocoin.ker.af/',
            updateXmlFilename: 'update.xml'
        }))
        .pipe(gulp.dest('./dist/chromium'));
});

gulp.task('default', () => {
    runSequence(
        'build:clean',
        'build:copy',
        [
            'build:manifest',
            'build:js',
            'build:css',
        ],
        [
            'pack:firefox',
            'pack:chrome',
            'pack:chromium',
        ]
    );
});