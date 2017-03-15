'use strict';

const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const merge = require('merge2');


let tsp = ts.createProject('tsconfig.json');


/**
 * Compile typescript scripts
 */
gulp.task('ts', () => {

    let tspr = tsp.src().pipe(sourcemaps.init()).pipe(tsp());

    return merge([
        tspr.dts.pipe(gulp.dest('.')),
        tspr.js.pipe(sourcemaps.write('.')).pipe(gulp.dest('.'))
    ]);
});

/**
 * Clean generated files
 */
gulp.task('clean', () => {
    return del([
        '**/*.js',
        '**/*.d.ts',
        '**/*.map',
        '!node_modules/**/*',
        '!*.js'
    ]);
});

/**
 * Watch for typescript changes
 */
gulp.task('watch', () => gulp.watch(['**/*.ts', '!**/*.d.ts'], ['ts']));

/**
 * Build resources
 */
gulp.task('build', ['clean', 'ts']);

/**
 * Build and watch resources
 */
gulp.task('dev', ['build', 'watch']);

/**
 * Default task
 */
gulp.task('default', ['build']);
