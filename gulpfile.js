'use strict';

var gulp = require('gulp');
var style = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var script = require('gulp-concat');
var plumber = require('gulp-plumber');
var eslint = require('gulp-eslint');
var babel = require('gulp-babel');

gulp.task('style', function() {
  gulp.src(['./src/css/style.scss'])
    .pipe(plumber())
    .pipe(style())
    .pipe(autoprefixer())
    .pipe(gulp.dest('./dst/css/'));
});

gulp.task('script', function(){
  gulp.src(['./src/script/index.js'])
  .pipe(plumber())
  .pipe(babel())
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
  .pipe(gulp.dest('./dst/script/'));
});

gulp.task('img', function(){
  gulp.src(['./src/img/*.jpg', './src/img/*.png', './src/img/*.gif'])
  .pipe(gulp.dest('./dst/img/'));
});

gulp.task('watch', function(){
  gulp.watch(['./src/css/*/*.scss', './src/script/*.js'], ['style', 'script']);
});
