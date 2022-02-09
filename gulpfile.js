var gulp = require("gulp");
var concatCss = require("gulp-concat-css");

gulp.task("default", function () {
  return gulp
    .src("assets/css/universalModules/*.css")
    .pipe(concatCss("universal.bundle.css"))
    .pipe(gulp.dest("assets/css/bundle/"));
});
