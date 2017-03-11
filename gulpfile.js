'use strict';

const gulp = require('gulp');
const ts = require('gulp-typescript');


let tsp = ts.createProject('tsconfig.json');


/**
 * Compile typescript scripts
 */
gulp.task('ts', () => tsp.src().pipe(tsp()).js.pipe(gulp.dest('.')));

/**
 * Watch for typescript changes
 */
gulp.task('watch', () => gulp.watch(['**/*.ts', '!**/*.d.ts'], ['ts']));

/**
 * Build resources
 */
gulp.task('build', ['ts']);

/**
 * Build and watch resources
 */
gulp.task('dev', ['build', 'watch']);

/**
 * Default task
 */
gulp.task('default', ['build']);
