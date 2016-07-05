/**
 * KARMA CONFIGURATION
 * http://karma-runner.github.io/1.0/config/configuration-file.html
 */

var configuration = {

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
        {pattern: 'node_modules/zone.js/dist/async-test.js', included: true, watched: false},
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
        {pattern: 'node_modules/immutable/**/*.js', included: false, watched: false},

        // Debug Tools Such As Source Maps
        {pattern: 'src/app/**/*.ts', included: false, watched: false},
        {pattern: 'public/app/**/*.js.map', included: false, watched: false}
    ],

    proxies: {
        '/public/src/app/': '/app/'
    },

    port: 9876,

    colors: true,

    autoWatch: true,

    browsers: [
        'Chrome',
    ],

    customLaunchers: {
        Chrome_travis_ci: {
            base: 'Chrome',
            flags: ['--no-sandbox']
        }
    },

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
};

/**
 * When Travis CI is running this Karma instance, alter the browser array.
 */
if (process.env.TRAVIS) {
    configuration.browsers = ['Chrome_travis_ci'];
}

module.exports = function(config) {
    // Uncomment the below line if the log level is to be altered
    //
    //configuration.logLevel = config.LOG_INFO;

    config.set(configuration)
};
