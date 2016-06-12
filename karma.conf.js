module.exports = function(config) {
    config.set({

        basePath: '',

        frameworks: [
            'jasmine'
        ],

        files: [
            // Global Libs
            {pattern: 'node_modules/moment/min/moment.min.js', included: true, watched: false},
            {
                pattern: 'node_modules/moment-timezone/builds/moment-timezone-with-data-2010-2020.min.js',
                included: true,
                watched: false
            },

            // Angular 2 Prerequisites
            {pattern: 'node_modules/zone.js/dist/zone.js', included: true, watched: false},
            {pattern: 'node_modules/zone.js/dist/fake-async-test.js', included: true, watched: false},
            {pattern: 'node_modules/reflect-metadata/Reflect.js', included: true, watched: false},
            {pattern: 'node_modules/systemjs/dist/system.src.js', included: true, watched: true},
            {pattern: 'node_modules/systemjs/dist/system-polyfills.js', included: true, watched: true},
            {pattern: 'node_modules/es6-shim/es6-shim.min.js', included: true, watched: true},

            // Config SystemJS
            {pattern: 'public/system.config.js', included: true, watched: true},
            {pattern: 'karma-test-shim.js', included: true, watched: true},

            // App & Module Assets Called Asynchronously
            {pattern: 'public/app/**/*.js', included: false, watched: true},
            {pattern: 'node_modules/@angular/**/*.js', included: false, watched: false},
            {pattern: 'node_modules/rxjs/**', included: false, watched: false},
            {pattern: 'node_modules/lodash/**/*.js', included: false, watched: false},
            {pattern: 'node_modules/marked/**/*.js', included: false, watched: false},
            {pattern: 'node_modules/numeral/**/*.js', included: false, watched: false},

            // Debug Tools Such As Source Maps
            {pattern: 'src/app/**/*.ts', included: false, watched: false},
            {pattern: 'public/app/**/*.js.map', included: false, watched: false}
        ],

        proxies: {
            '/public/src/app/': '/app/'
        },

        port: 9876,

        logLevel: config.LOG_INFO,

        colors: true,

        autoWatch: true,

        browsers: [
            'PhantomJS',
            //'Chrome',
        ],

        // Karma plugins loaded
        plugins: [
            'karma-jasmine',
            //'karma-coverage',
            //'karma-jasmine-diff-reporter',
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
        ],

        // Coverage reporter generates the coverage
        reporters: [
            //'jasmine-diff',
            //'progress',
            'dots',
            //'coverage'
        ],

        // Source files that you wanna generate coverage for.
        // Do not include tests or libraries (these files will be instrumented by Istanbul)
        preprocessors: {
            //'dist/**/!(*spec).js': ['coverage']
        },

        //coverageReporter: {
        //    reporters:[
        //        {type: 'json', subdir: '.', file: 'coverage-final.json'}
        //    ]
        //},

        singleRun: true,

        concurrency: Infinity,
    })
};
