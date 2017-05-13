var autoprefixer = require("gulp-autoprefixer"),
    babelify = require("babelify"),
    browserify = require("browserify"),
    buffer = require("vinyl-buffer"),
    gulp = require("gulp"),
    htmlmin = require("gulp-htmlmin"),
    jsonminify = require("gulp-jsonminify"),
    sass = require("gulp-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    source = require("vinyl-source-stream"),
    uglify = require("gulp-uglify");

gulp.task("html", function() {
    return gulp.src("src/*.html")
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest("dist"));
});

gulp.task("scss", function () {
    return gulp.src("src/styles/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass.sync({outputStyle: "compressed"}).on("error", sass.logError))
        .pipe(autoprefixer({
            browsers: ["last 2 versions"],
            cascade: false
        }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist/styles"));
});

gulp.task("js", function() {

    var bundler = browserify("src/js/bootstrap.js", { debug: true })
        .transform(babelify, {presets: ["es2015"]});

    return bundler.bundle()
        .on("error", function(error) {
            process.stderr.write(error + "\n");
            this.emit("end"); 
        })
        .pipe(source("snapgram.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist/js"));
});

gulp.task("json", function () {
    return gulp.src(["src/data/*.json"])
        .pipe(jsonminify())
        .pipe(gulp.dest("dist/data"));
});

gulp.task("default", ["html", "scss", "js", "json"]);

gulp.task("watch", function () {
    gulp.watch("src/*.html", ["html"]);
    gulp.watch("src/styles/*.scss", ["scss"]);
    gulp.watch("src/js/*.js", ["js"]);
    gulp.watch("src/data/*.json", ["json"]);
});
