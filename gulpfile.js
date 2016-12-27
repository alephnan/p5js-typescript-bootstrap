const gulp = require('gulp');
const del = require('del');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');
const p5dtsgenerator = require('./scripts/generate-p5-typescript-definition');
const runSequence = require('gulp-run-sequence');
const paths = {
    pages: ['src/*.html'],
    libraries: ['node_modules/p5/lib/p5.js'],
    generatedP5TDSTemp : 'scripts/generated',
    srcDir: 'src'
};
const GENERATED_INSTANCE_MODE_P5_D_TS_FILENAME = 'p5.d.ts';

// Convert p5dtsgenerator to return streams
gulp.task('generate-p5-ts', () => {
  return p5dtsgenerator.generate({
      'outputDirName': paths.generatedP5TDSTemp
  });
});
gulp.task('move-p5-ts', ['generate-p5-ts'], () => {
  return gulp.src(paths.generatedP5TDSTemp + '/' + GENERATED_INSTANCE_MODE_P5_D_TS_FILENAME)
    .pipe(gulp.dest(paths.srcDir));
});
gulp.task('clean-generate-p5-ts', () => {
  return del(paths.generatedP5TDSTemp);
});
gulp.task('initialize-p5-ts', () => {
    runSequence('move-p5-ts', 'clean-generate-p5-ts');
});
gulp.task('clean-p5-ts', () => {
  return del(paths.srcDir + '/' + GENERATED_INSTANCE_MODE_P5_D_TS_FILENAME);
});

gulp.task('clean-dist', () => {
    return del('dist/**/*');
});

gulp.task('clean', ['clean-dist', 'clean-p5-ts', 'clean-generate-p5-ts'], () => {
    return del('dist');
});

gulp.task('copy-html', () => {
    return gulp.src(paths.pages)
        .pipe(gulp.dest('dist'));
});

gulp.task('move-assets', () => {
    // TODO(automatwon): explicitly enforce dependency on library node_modules or 
    // don't move based on assumed file path
    return gulp.src(paths.libraries)
        .pipe(gulp.dest('dist/js/lib'));
});

gulp.task('default', ['copy-html', 'move-assets'], () => {
    // TODO(automatwon): explicit enforce move-p5-ts ran
    return browserify({
            basedir: '.',
            debug: true,
            entries: ['src/main.ts'],
            cache: {},
            packageCache: {}
        })
        .plugin(tsify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/js/src'));
});

// TODO(automatwon): Add init task that generates p5 TS definitions and then build, clean, etc.