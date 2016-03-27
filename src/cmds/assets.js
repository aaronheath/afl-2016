'use strict';

const fs = require('fs-extra');
const colors = require('colors');

const appSrcDir = __dirname + '/../app/';
const publicDataDir = __dirname + '/../../public/app/';

const assetsTest = /.+\.htm(l)?$/;

startLoop();
handleOthers();

function startLoop(pathToAppend) {
    pathToAppend = !pathToAppend ? '' : pathToAppend;

    const path = `${appSrcDir}${pathToAppend}`;

    fs.readdir(path, (err, entities) => {
        handleReadDirCb(err, entities);
    });

    function handleReadDirCb(err, entities) {
        if(err) {
            console.error('Unable to readdir'.red, err);
            return;
        }

        loopDirContents(entities)
    }

    function loopDirContents(entities) {
        entities.forEach((entity) => {
            fs.stat(`${path}${entity}`, (err, stat) => {
                handleStatCb(err, stat, entity)
            });
        });
    }

    function handleStatCb(err, stat, entity) {
        if(err) {
            console.error('Unable to stat entity'.red, [entity, err]);
            return;
        }

        if(stat.isFile()) {
            copy(`${pathToAppend}${entity}`);
        }

        if(stat.isDirectory()) {
            startLoop(`${pathToAppend}${entity}/`);
        }
    }

    function copy(_append) {
        fs.copy(`${appSrcDir}${_append}`, `${publicDataDir}${_append}`, {
            filter: assetsTest,
            clobber: true,
        }, (err) => {
            if(err) {
                console.error('Unable to copy file'.red, err);
                return;
            }

            if(_append.match(assetsTest)) {
                console.log('Template file copy successful'.green, _append);
            }
        });
    }
}

function handleOthers() {
    console.log('dirname', __dirname);
    fs.copy(__dirname + '/../../readme.md', __dirname + '/../../public/data/readme.md', (err) => {
        if(err) {
            console.error('Unable to copy readme'.red, err);
        }
    });
}
