module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: [
            'systemjs',
            'jasmine'
        ],


        // list of files / patterns to load in the browser
        files: [
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/moment/min/moment.min.js',
            'node_modules/moment-timezone/builds/moment-timezone-with-data-2010-2020.min.js',
            'node_modules/es6-shim/es6-shim.min.js',
            'node_modules/systemjs/dist/system-polyfills.js',
            'node_modules/angular2/es6/dev/src/testing/shims_for_IE.js',
            'node_modules/angular2/bundles/angular2-polyfills.js',
            'node_modules/systemjs/dist/system.src.js',
            'node_modules/rxjs/bundles/Rx.js',
            'node_modules/angular2/bundles/angular2.dev.js',
            'node_modules/angular2/bundles/router.dev.js',
            'node_modules/angular2/bundles/http.dev.js',
            //'src/sjs-tests.js',
            //{
            //    pattern: 'public/**/*.spec.js',
            //    watched: false,
            //},
            'src/app/helpers/utils.spec.ts',
        ],


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: [
            //'jasmine-diff',
            'dots'
        ],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            //'PhantomJS',
            //'Chrome'
        ],

        plugins: [
            'karma-systemjs',
            'karma-phantomjs-launcher',
            'karma-jasmine',
        ],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        systemjs: {
            // Path to your SystemJS configuration file
            configFile: 'system.config.js',

            // Patterns for files that you want Karma to make available, but not loaded until a module requests them. eg. Third-party libraries.
            serveFiles: [
                'src/app/**/*.ts',
            ],

            config: {
                transpiler: 'typescript',
                paths: {
                    'systemjs': 'node_modules/systemjs/dist/system.js',
                    'system-polyfills': 'node_modules/systemjs/dist/system-polyfills.js',
                    'es6-module-loader': 'node_modules/es6-module-loader/dist/es6-module-loader.js',
                    'typescript': 'node_modules/typescript/lib/typescript.js',

                    'moment': 'node_modules/moment/min/moment.min.js',
                },
                packages: {
                    src: {
                        defaultExtension: 'ts'
                    }
                },
            }

            // SystemJS configuration specifically for tests, added after your config file.
            // Good for adding test libraries and mock modules
            //config: {
            //    paths: {
            //        'angular-mocks': 'bower_components/angular-mocks/angular-mocks.js'
            //    }
            //}
        }
    })
}
