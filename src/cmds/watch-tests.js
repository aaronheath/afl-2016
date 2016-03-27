'use strict';

/**
 * Watches for changes to .spec.ts files. When changed, typescript recompile is performed.
 */

const fs = require('fs');
const colors = require('colors');
const watch = require('watch');
const shell = require('shelljs');

const appSrcDir = __dirname + '/../app';

let compiling = false;

const options = {
    filter: (path, stat) => {
        if(stat.isDirectory()) {
            return true;
        }

        return !!path.match(/.+\.spec\.ts$/)
    },
};

watch.createMonitor(appSrcDir, options, (monitor) => {
    monitor.on('created', recompile);
    monitor.on('changed', recompile);

    console.log(`Watching`.green);
});

/**
 * Attempts to recompile typescripts and then calls lint() if successful
 */
function recompile() {
    if(compiling) {
        return;
    }

    compiling = true;

    console.log('Starting compile'.green);

    shell.exec('npm run tsc', {async: true}, (code, stdout, stderr) => {
        if(code === 0) {
            console.log(`Typescript compile completed`.green);

            lint();
        } else {
            console.error(`Typescript compile failed`.red);
        }

        compiling = false;
    });
}

/**
 * Lints typescripts then calls test() if successful
 */
function lint() {
    console.log('Starting lint'.green);

    shell.exec('npm run lint', {async: true}, (code, stdout, stderr) => {
        if(code === 0) {
            console.log(`Linted successfully`.green);

            test();
        } else {
            console.error(`Linting failed`.red);
        }
    });
}

/**
 * Runs tests
 */
function test() {
    console.log('Starting tests'.green);

    shell.exec('npm run tests-only', {async: true}, (code, stdout, stderr) => {
        if(code === 0) {
            console.log(`Tested successfully`.green);
        } else {
            console.error(`Testing failed`.red);
        }
    });
}
