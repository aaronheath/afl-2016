module.exports = function(config) {
    config.set({

        basePath: '.',

        frameworks: [
            'jasmine'
        ],

        files: [
            // paths loaded by Karma
            {pattern: 'node_modules/es6-shim/es6-shim.min.js', included: true, watched: true},
            {pattern: 'node_modules/systemjs/dist/system-polyfills.js', included: true, watched: true},
            {pattern: 'node_modules/angular2/es6/dev/src/testing/shims_for_IE.js', included: true, watched: true},
            {pattern: 'node_modules/angular2/bundles/angular2-polyfills.js', included: true, watched: true},
            {pattern: 'node_modules/systemjs/dist/system.src.js', included: true, watched: true},
            {pattern: 'node_modules/rxjs/bundles/Rx.js', included: true, watched: true},

            {pattern: 'node_modules/angular2/bundles/angular2.dev.js', included: true, watched: true},
            {pattern: 'node_modules/angular2/bundles/testing.dev.js', included: true, watched: true},
            {pattern: 'node_modules/angular2/bundles/http.dev.js', included: true, watched: true},

            {pattern: 'karma-test-shim.js', included: true, watched: true},

            // paths loaded via module imports
            {pattern: 'public/app/**/*.js', included: false, watched: true},
            {pattern: 'node_modules/numeral/**/*.js', included: false, watched: true},

            // paths to support debugging with source maps in dev tools
            {pattern: 'src/app/**/*.ts', included: false, watched: false},
            {pattern: 'public/app/**/*.js.map', included: false, watched: false}
        ],

        // proxied base paths
        proxies: {
            // required for component assests fetched by Angular's compiler
            '/public/src/app/': '/app/'
        },

        port: 9876,

        logLevel: config.LOG_INFO,

        colors: true,

        autoWatch: false,

        browsers: [
            //'PhantomJS',
            'Chrome',
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
