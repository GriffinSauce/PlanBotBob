var gulp = require('gulp');
var watch = require('gulp-watch');
var browserSync = require('browser-sync').create();
var server = require( 'gulp-develop-server');

gulp.task('default', ['watch']);

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch(['.rebooted', '**/*.html', '**/*.css']).on("change", browserSync.reload);
    gulp.watch(['**/*.js', '!gulpfile.js', '!node_modules/**/*'], server.restart);
});

gulp.task('browser-sync', ['server:start'], function() {
    return browserSync.init(null, {
        proxy: 'localhost:3000',
        port: 7000,
        open: false,
        notify: true
    });
});

gulp.task( 'server:start', function(cb) {
    return server.listen({
        path: 'server.js'
    }, function( error ) {
        if( ! error ){
            cb();
        }
    });
});
