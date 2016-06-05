// Tun on full stack traces in errors to help debugging
Error.stackTraceLimit = Infinity;

//jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

// // Cancel Karma's synchronous start,
// // we will call `__karma__.start()` later, once all the specs are loaded.
__karma__.loaded = function() {};

var afl2016 = Object.assign(window.afl2016);

afl2016.packages['base/public/app'] = afl2016.packages.app;
delete afl2016.packages.app;

for(var key in afl2016.map) {
    if(!afl2016.map.hasOwnProperty(key) || key === 'app') {
        continue;
    }

    afl2016.map[key] = 'base/' + afl2016.map[key];
}

for(var key in afl2016.paths) {
    if(!afl2016.paths.hasOwnProperty(key)) {
        continue;
    }

    afl2016.paths[key] = 'base/' + afl2016.paths[key];
}

window.afl2016 = afl2016;

System.config(window.afl2016);

Promise.all([
        System.import('base/public/app/helpers/utils.spec'),
        System.import('base/public/app/components/list-matches/list-matches.spec'),
        System.import('base/public/app/pipes/format-number.spec'),
        System.import('base/public/app/services/matches.spec'),
        System.import('base/public/app/services/teams.spec'),
    ])
    .then(function() { __karma__.start(); }, function(error) { __karma__.error(error.stack || error); })
    .catch(console.error.bind(console));
