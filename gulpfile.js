const gulp = require('gulp');
const del = require('del');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');
const fileExists = require('file-exists');
const p5dtsgenerator = require('./scripts/generate-p5-typescript-definition');
const runSequence = require('gulp-run-sequence');

const GENERATED_INSTANCE_MODE_P5_D_TS_FILENAME = 'p5.d.ts';
const paths = {
    pages: ['src/*.html'],
    libraries: ['node_modules/p5/lib/p5.js'],
    generatedP5TSDTemp : 'scripts/generated',
    srcDir: 'src',
    generatedP5TSDTempPath: null,
    generatedP5TSDPath: null,
    init: function() {
        this.generatedP5TSDTempPath = this.generatedP5TSDTemp + '/' + GENERATED_INSTANCE_MODE_P5_D_TS_FILENAME;
        this.generatedP5TSDPath = this.srcDir + '/' + GENERATED_INSTANCE_MODE_P5_D_TS_FILENAME;
        return this;
    }
}.init();

// Convert p5dtsgenerator to return streams
gulp.task('generate-p5-ts', () => {
  return p5dtsgenerator.generate({
      'outputDirName': paths.generatedP5TSDTemp
  });
});
gulp.task('move-p5-ts', ['generate-p5-ts'], () => {
  return gulp.src(paths.generatedP5TSDTempPath)
    .pipe(gulp.dest(paths.srcDir));
});
gulp.task('clean-generate-p5-ts', () => {
  return del(paths.generatedP5TSDTemp);
});
gulp.task('initialize-p5-ts', () => {
    runSequence('move-p5-ts', 'clean-generate-p5-ts');
});
gulp.task('clean-p5-ts', () => {
  return del(paths.generatedP5TSDPath);
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

gulp.task('build', () => {
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

gulp.task('default', () => {
    const seq = [['copy-html', 'move-assets'], 'build'];
    if(!fileExists(paths.generatedP5TSDPath)) {
        seq.unshift('initialize-p5-ts');
    }
    runSequence.apply(null, seq);
});
