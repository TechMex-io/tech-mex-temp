'use strict';

/* Needed gulp config */
import gulp from 'gulp'; 
import hb from 'gulp-hb';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import plumber from 'gulp-plumber';
import browserSync from 'browser-sync';
const reload = browserSync.reload;

/* Init task */
gulp.task('init', ['hbs', 'sass', 'images']);

/* Handllebars */
gulp.task('hbs', () => {
  return gulp
    .src('./src/views/**/*.html')
    .pipe(hb({
      partials: './src/views/partials/**/*.hbs',
      helpers: './src/views/helpers/*.js',
      data: './src/data/**/*.{js,json}'
    }))
    .pipe(gulp.dest('./dist/'))
    /* Reload the browser CSS after every change */
    .pipe(reload({stream:true}));
});

/* Sass task */
gulp.task('sass', () => {  
  gulp.src('./src/scss/custom.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('styles.css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css'))
    /* Reload the browser CSS after every change */
    .pipe(reload({stream:true}));
});

// images
gulp.task('images', () => {
  gulp.src('./src/images/**/*')
    .pipe(plumber())
    .pipe(gulp.dest('./dist/images'))
    /* Reload the browser CSS after every change */
    .pipe(reload({stream:true}));
});


/* Reload task */
gulp.task('bs-reload', () => {
  browserSync.reload();
});

/* Prepare Browser-sync for localhost */
gulp.task('browser-sync', () => {
  browserSync.init(['css/*.css', 'js/*.js'], {
      /*
      I like to use a vhost, WAMP guide: https://www.kristengrote.com/blog/articles/how-to-set-up-virtual-hosts-using-wamp, XAMP guide: http://sawmac.com/xampp/virtualhosts/
      */
      // proxy: 'your_dev_site.url'
      /* For a static server you would use this: */
      
      server: {
          baseDir: './'
      }
      
  });
});

gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
});

gulp.task('watch', () => {
  /* Watch scss, run the sass task on change. */
  gulp.watch(['./src/scss/*.scss', './src/scss/**/*.scss'], ['sass'])
  /* Watch images, run the assets task on change. */
  gulp.watch(['./src/images/**/*', './src/images/**/*'], ['images'])
  /* Watch app.js file, run the scripts task on change. */
  // gulp.watch(['./src/js/custom.js'], ['scripts'])
  /* Watch .html files, run the bs-reload task on change. */
  gulp.watch(['./src/views/**/*'], ['hbs', 'bs-reload']);
})


/* Watch scss, js and html files, doing different things with each. */
gulp.task('default', ['watch', 'serve']);
