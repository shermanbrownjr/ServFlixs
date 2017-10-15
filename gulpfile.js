var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var webpack = require('webpack-stream');

var src = ['*.js', 'src/**/*.js'];
var pugFiles = ['src/app/views/*.pug'];
var serverFiles = ['src/server/*.json','src/server/*.js','src/server/**/*.js'];

gulp.task("pug", function () {
    return gulp.src(pugFiles)
        .pipe(gulp.dest("dist/app/views"));
});

gulp.task("server", function () {
    return gulp.src(serverFiles)
        .pipe(gulp.dest("dist"));
});

gulp.task('webpack', function () {
    return gulp.src('./src/app/index.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('dist/app/lib'));
});

gulp.task('start', function () {
    var options = {
        script: './dist/server.js',
        delayTime: 1,
        env: {
            'PORT': 3000
        },
        watch: ["dist/"]
    }

    return nodemon(options)
        .on('restart', function (ev) {
            console.log('Restarting....'); 
        })
});

gulp.task("watch", function() {
	gulp.watch(["./src/**/*"], ["pug","webpack","server"]);
});