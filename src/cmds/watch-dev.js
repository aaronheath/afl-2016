'use strict';

/**
 * Initialises Browsersync and watches for .ts file changes. Upon file change a typescript compile is performed.
 */

const fs = require('fs');
const colors = require('colors');
const watch = require('watch');
const shell = require('shelljs');
const bs = require('browser-sync').create();

const appSrcDir = __dirname + '/../app';
const publicDataDir = './public/';

let compiling = false;

/**
 * Initialise Browsersync
 */

bs.init({
    files: [`${publicDataDir}**/*`],
    proxy: 'afl-2016.dev',
});

/**
 * Initialise Watcher
 */
const options = {
    filter: (path, stat) => {
        if(stat.isDirectory()) {
            return true;
        }

        return !!path.match(/.+\.ts$/)
    },
};

watch.createMonitor(appSrcDir, options, (monitor) => {
    monitor.on('created', recompile);
    monitor.on('changed', recompile);

    console.log(`Watching`.green);
});

/**
 * Recompile typescripts
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
        } else {
            console.error(`Typescript compile failed`.red);
        }

        compiling = false;
    });
}
