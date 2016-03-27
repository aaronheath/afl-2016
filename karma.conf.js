module.exports = function(config) {
    config.set({
        basePath: '',

        systemjs: {
            defaultJSExtensions: true,

            serveFiles: [
                'public/app/**/*.js',
            ],

            config: {
                transpiler: 'babel',
                paths: {
                    'systemjs': 'node_modules/systemjs/dist/system.src.js',
                    'system-polyfills': 'node_modules/systemjs/dist/system-polyfills.js',
                    'es6-module-loader': 'node_modules/es6-module-loader/dist/es6-module-loader.js',
                    'babel': 'node_modules/babel-core/browser.js',
                    'moment': 'node_modules/moment/min/moment.min.js',
                },
                packages: {
                    'public/app': {
                        format: 'register',
                        defaultExtension: 'js'
                    }
                },
            }
        },

        files: [
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/moment/min/moment.min.js',
            'node_modules/moment-timezone/builds/moment-timezone-with-data-2010-2020.min.js',
            'node_modules/es6-shim/es6-shim.min.js',

            // TODO looking for 'crypo' node module. As we're not yet testing Angular
            // itself we can comment this asset out for now.
            // 'node_modules/systemjs/dist/system-polyfills.js',

            'node_modules/angular2/es6/dev/src/testing/shims_for_IE.js',
            'node_modules/rxjs/bundles/Rx.js',
            'node_modules/angular2/bundles/angular2.dev.js',
            'node_modules/angular2/bundles/router.dev.js',
            'node_modules/angular2/bundles/http.dev.js',
            {
                pattern: 'public/**/*.spec.js',
                watched: false,
            },
        ],

        frameworks: [
            'systemjs',
            'jasmine'
        ],

        exclude: [
        ],

        preprocessors: {
        },

        reporters: [
            'jasmine-diff',
            'dots'
        ],

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,

        autoWatch: false,

        browsers: [
            'PhantomJS',
            //'Chrome',
        ],

        plugins: [
            'karma-systemjs',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-jasmine-diff-reporter',
        ],

        singleRun: true,

        concurrency: Infinity,
    })
}
