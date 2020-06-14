var gulp = require('gulp'),
    sass = require('gulp-sass'),
    pug = require('gulp-pug'),
    pugInheritance = require('gulp-pug-inheritance'),
    changed = require('gulp-changed'),
    cached = require('gulp-cached'),
    gulpif = require('gulp-if'),
    filter = require('gulp-filter'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync'),
    fileinclude = require('gulp-file-include'),
    notify = require('gulp-notify'),
    imagemin = require('gulp-imagemin'),
    ftp = require('vinyl-ftp'),
    uglify = require('gulp-uglify'),
    surge = require('gulp-surge'),
    beep = require('beepbeep'),
    cssimport = require('gulp-cssimport'),
    cssnano = require('gulp-cssnano'),
    spritesmith = require('gulp.spritesmith'),
    size = require('gulp-size'),
    svgstore = require('gulp-svgstore'),
    gutil = require('gulp-util'),
    svgmin = require('gulp-svgmin'),
    newer = require('gulp-newer'),
    del = require('del'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps');


function error_handler(error) {
    beep();
    return 'ERROR: ' + error.message;
}

var project = 'main',
    npm = './node_modules/',
    bower = './bower_components/';


var baseDirs = {
    build: 'build/',
    dist: 'dist/' + project + '/',
    src: 'src/'
}

var ftp_options = {
    host: 'gv253770.ftp.ukraine.com.ua',
    user: 'gv253770_ftp',
    password: '19r0zk4v',
    dest: './testmticket.in.ua/new-widget', // dest on ftp server
    parallel: 10,
    log: gutil.log,
}

var config = {

    templates: {
        src: baseDirs.src + 'templates/**/*.pug',
        watch: baseDirs.src + 'templates/**/*.pug'
    },

    styles: {
        src: baseDirs.src + 'sass/*.scss',
        dest: baseDirs.build + 'css/',
        watch: baseDirs.src + 'sass/**/*(*.scss|*.sass)',
        sass: {
            outputStyle: 'compressed',
            includePaths: [
                npm + 'scut/dist',
                npm,
                bower
            ]
        }
    },

    jsDeps: {
        chunks: [
            npm + 'jquery/dist/jquery.js',
            // bower+'PACE/pace.js',
            npm + 'svg4everybody/dist/svg4everybody.js',
            npm + 'jquery-touchswipe/jquery.touchSwipe.js',
            npm + 'magnific-popup/dist/jquery.magnific-popup.js',
            npm + 'jquery.scrollbar/jquery.scrollbar.js',
            npm + 'jquery-nice-select/js/jquery.nice-select.js',
            npm + 'components-jqueryui/jquery-ui.js',
            npm + 'bootstrap/js/dist/util.js',
            npm + 'bootstrap/js/dist/alert.js',
            npm + 'bootstrap/js/dist/modal.js',
            bower + 'jquery.maskedinput/dist/jquery.maskedinput.js',
            bower + 'tooltipster/dist/js/tooltipster.bundle.js',
            bower + 'jquery.easy-pie-chart/dist/jquery.easypiechart.min.js',
            npm + 'vue/dist/vue.min.js',
            npm + 'bootbox/bootbox.js',
            npm + 'iframe-resizer/js/iframeResizer.contentWindow.js',
            npm + 'air-datepicker/dist/js/datepicker.js',
            // npm+'slick-carousel/slick/slick.js'
        ],
        file: 'deps.js',
        dest: baseDirs.build + 'js/'
    },

    scripts: {
        chunks: [
            baseDirs.src + 'js/_inc/*.js',
            // baseDirs.src+'js/steps.js',
            baseDirs.src + 'js/main.js'
        ],
        file: 'main.js',
        dest: baseDirs.build + 'js/',
        watch: baseDirs.src + 'js/**/*.js'
    },

    images: {
        src: [baseDirs.src + 'img/**/*(*.png|*.jpg|*.jpeg|*.gif|*.ico|*.svg|*.xml|*.json)', '!' + baseDirs.src + 'img/sprite', '!' + baseDirs.src + 'img/sprite/**'],
        dest: baseDirs.build + 'img/',
        watch: baseDirs.src + 'img/**/*(*.png|*.jpg|*.jpeg|*.gif|*.ico|*.svg)'
    },

    fonts: {
        src: baseDirs.src + 'fonts/**/*',
        dest: baseDirs.build + 'fonts/'
    },

    sprite: {
        src: baseDirs.src + 'img/sprite/*.{png,jpg,gif}',
        dest: baseDirs.build + 'img/',
        sass: baseDirs.src + 'sass/_inc',
        watch: baseDirs.src + 'img/sprite/**/*(*.png|*.jpg|*.jpeg|*.gif)'
    },

    svg: {
        src: baseDirs.src + 'img/sprite/*.svg',
        dest: baseDirs.build + 'img/',
        watch: baseDirs.src + 'img/sprite/*.svg'
    },

    dist: {
        css: baseDirs.dist + 'css/',
        img: [baseDirs.build + 'img/**/*(*.png|*.jpg|*.jpeg|*.gif|*.ico)'],
        minDest: baseDirs.dist + 'img/',
        jsmin: baseDirs.dist + 'js/'
    }

}


// templates
gulp.task('templates', function () {
    return gulp.src(config.templates.src)
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'Error: Compiling PUG.',
                message: '<%= error.message %>'
            })
        }))
        .pipe(changed(baseDirs.build, {extension: '.html'}))
        .pipe(gulpif(global.isWatching, cached('pug')))
        .pipe(pugInheritance({basedir: baseDirs.src + 'templates', skip: 'node_modules'}))
        .pipe(filter(function (file) {
            return !/\/_/.test(file.path) && !/^_/.test(file.relative);
        }))
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(baseDirs.build))
        .pipe(browserSync.stream());
});

gulp.task('setWatch', function () {
    global.isWatching = true;
});


// html
gulp.task('html', function () {
    return gulp
        .src('src/html/*.html')
        .pipe(
            plumber({
                errorHandler: notify.onError(function (error) {
                    return error_handler(error);
                })
            })
        )
        .pipe(
            fileinclude({
                prefix: '@'
            })
        )
        .pipe(gulp.dest('./build'));
});

gulp.task('html:watch', ['html'], function (done) {
    browserSync.reload();
    done();
});


// styles
gulp.task('styles', function () {
    return gulp.src(config.styles.src)
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'Error: Compiling SCSS.',
                message: '<%= error.message %>'
            })
        }))
        .pipe(sourcemaps.init())
        .pipe(sass(config.styles.sass))
        .pipe(autoprefixer({
            browsers: ['ie >= 9', 'last 5 iOS versions']
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(cssimport({}))
        .pipe(size())
        .pipe(gulp.dest(config.styles.dest))
        .pipe(browserSync.stream({match: '**/*.css'}));
});


// dependencies for project scripts
gulp.task('deps', function () {
    return gulp.src(config.jsDeps.chunks)
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'Error: Concat for DEPS failed.',
                message: '<%= error.message %>'
            })
        }))
        .pipe(concat(config.jsDeps.file))
        .pipe(uglify())
        .pipe(gulp.dest(config.jsDeps.dest));
});


// project scripts
gulp.task('scripts', function () {
    return gulp.src(config.scripts.chunks)
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'Error: Concat failed.',
                message: '<%= error.message %>'
            })
        }))
        .pipe(sourcemaps.init())
        .pipe(concat(config.scripts.file))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(size())
        .pipe(gulp.dest(config.scripts.dest))
        .pipe(browserSync.stream());
});

// project scripts demo
gulp.task('demo', function () {
    return gulp.src([baseDirs.src + 'js/_demo/*.js'])
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'Error: Concat failed.',
                message: '<%= error.message %>'
            })
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('demo.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(size())
        .pipe(gulp.dest(baseDirs.build + 'js/'))
        .pipe(browserSync.stream());
});


// image
gulp.task('images', function () {
    return gulp.src(config.images.src)
        .pipe(newer(config.images.dest))
        .pipe(gulp.dest(config.images.dest));
});


// fonts
gulp.task('fonts', function () {
    return gulp.src(config.fonts.src)
        .pipe(newer(config.fonts.dest))
        .pipe(gulp.dest(config.fonts.dest));
});


// sprite
gulp.task('sprite', function () {
    var spriteData = gulp.src(config.sprite.src).pipe(spritesmith({
        // retinaSrcFilter: [baseDirs.src + 'img/sprite/*@2x.{png,jpg,gif}'],
        imgName: 'sprite.png',
        // retinaImgName: 'sprite@2x.png',
        cssName: '_sprite.scss',
        imgPath: '../img/sprite.png'
    }));

    spriteData.img.pipe(gulp.dest(config.sprite.dest));
    spriteData.css.pipe(gulp.dest(config.sprite.sass));
});


// svg sprite
gulp.task('svg', function () {
    return gulp
        .src(config.svg.src)
        .pipe(svgmin())
        .pipe(svgstore())
        .pipe(gulp.dest(config.svg.dest));
});


// clean build
gulp.task('clean', function () {
    return del([baseDirs.build]);
});
// clean dist
gulp.task('utils-wipe', function () {
    return del([baseDirs.dist]);
});


// DIST AND OPTIMIZATION
gulp.task('utils-dist', ['build', 'utils-wipe'], function () {
    return gulp.src([baseDirs.build + '**/*'])
        .pipe(gulp.dest(baseDirs.dist));
});


// image optimize [disabled]
gulp.task('images-optimize', ['utils-dist'], function () {
    return gulp.src(config.dist.img)
        .pipe(imagemin({
            errorHandler: notify.onError({
                title: 'Error: image min failed.',
                message: '<%= error.message %>'
            })
        }))
        .pipe(gulp.dest(config.dist.minDest));
});


// Compress css
gulp.task('cssuglify', ['utils-dist'], function () {
    return gulp.src(config.dist.css + '*.css')
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'Error: CSS Uglify failed.',
                message: '<%= error.message %>'
            })
        }))
        .pipe(cssnano())
        .pipe(gulp.dest(config.dist.css));
});

// scripts uglify
gulp.task('compressjs', ['cssuglify'], function () {
    return gulp.src(config.scripts.dest + 'bundle.js')
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'Error: uglify failed.',
                message: '<%= error.message %>'
            })
        }))
        .pipe(uglify())
        .pipe(gulp.dest(config.dist.jsmin));
});

// deploy
gulp.task('deploy', ['compressjs'], function () {

    var conn = ftp.create(ftp_options);

    return gulp.src(baseDirs.dist + '**', {base: baseDirs.dist, buffer: false})
        .pipe(conn.dest(ftp_options.dest));

});


// Server and watch
gulp.task('server', function () {

    browserSync.init({
        server: baseDirs.build,
        open: false,
        notify: false
    });

    gulp.watch([config.styles.watch], ['styles']);
    // gulp.watch([config.templates.watch], ['setWatch', 'templates']);
    gulp.watch('src/html/**/*.html', ['html:watch']);
    gulp.watch([config.scripts.watch], ['scripts', 'demo']);
    gulp.watch([config.images.watch], ['images']);
    gulp.watch([config.sprite.watch], ['sprite']);
    gulp.watch([config.svg.watch], ['svg']);

});


gulp.task('build', ['styles', 'deps', 'html', 'scripts', 'demo', 'images', 'fonts', 'sprite', 'svg']);

gulp.task('dev', ['build', 'server']);

gulp.task('dist', ['compressjs']);

gulp.task('default', ['dev']);
