const gulp = require('gulp');
const del = require('del');
const p5dtsgenerator = require('./scripts/generate-p5-typescript-definition');
const paths = {
    generatedP5TDSTemp : 'scripts/generated',
};

// Convert p5dtsgenerator to return streams
gulp.task('generate-p5-ts', () => {
  return p5dtsgenerator.generate({
      'outputDirName': paths.generatedP5TDSTemp
  });
});
gulp.task('move-p5-ts', ['generate-p5-ts'], () => {
  return gulp.src(paths.generatedP5TDSTemp + '/p5.d.ts')
    .pipe(gulp.dest('src'));
});
gulp.task('clean-generate-p5-ts', ['move-p5-ts'], () => {
  return del(paths.generatedP5TDSTemp);
});

gulp.task('default', () => {

});