var gulp = require("gulp"),
    clean = require('gulp-clean'),
    iconfont = require('gulp-iconfont'),
    consolidate = require('gulp-consolidate'),

    runTimestamp = Math.round(Date.now() / 1000),
    fontName = 'home_font', // font-family name
    className = 'iconfont', // class name
    template = 'fontawesome-style'; // tpl name

gulp.task('iconfont', ['clean'], function() {
    return gulp.src('svg/*.svg')
        .pipe(iconfont({
            fontName: fontName,
            appendUnicode: true,
            normalize: true, //如果编译后的字体出现了变形，就要加上normalize、fontHeight选项
            fontHeight: 1001,
            formats: ['ttf', 'eot', 'woff', 'svg'], // 默认：['ttf', 'eot', 'woff'], 还可以加'woff2', 'svg'
            timestamp: runTimestamp // recommended to get consistent builds when watching files
        }))
        .on('glyphs', function(glyphs) {
            // 设置demo模版需要的参数
            var options = {
                glyphs: glyphs.map(function(glyph) {
                    // 字体信息
                    return {
                        name: glyph.name,
                        codepoint: glyph.unicode[0].charCodeAt(0)
                    }
                }),
                fontName: fontName, // 字体名字
                timer: +(new Date()), // 时间戳，编译的时候会放到引用后面
                fontPath: '../fonts/', // css 引用的路径
                className: className
            };

            // 字体图标样式
            gulp.src('templates/iconfont.css')
                .pipe(consolidate('lodash', options))
                .pipe(gulp.dest('dist/css/'));

            // 字体图标演示
            gulp.src('templates/demo.html')
                .pipe(consolidate('lodash', options))
                .pipe(gulp.dest('dist/'));

            // demo样式，实际项目中不需要
            gulp.src('templates/demo.css')
                .pipe(gulp.dest('dist/css/'));
        })
        .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('clean', function() {
    return gulp.src('dist', {
        read: false
    }).pipe(clean());
});
gulp.task('default', ['iconfont']);