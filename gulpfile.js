const gulp = require('gulp');
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

gulp.task('default', () => {

});