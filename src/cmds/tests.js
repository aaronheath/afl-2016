const colors = require('colors');
const shell = require('shelljs');

tsc()
    .then(lint)
    .then(karma)
    .catch(function(reason) {
        console.error(reason.red);
        process.exit(1);
    });

function tsc() {
    return createPromise('npm run tsc', 'Typescript compile failed.');
}

function lint() {
    return createPromise('npm run lint', 'Linting failed.');
}

function karma() {
    return createPromise('npm run karma', 'Karma tests failed.');
}

function createPromise(cmd, rejectMessage) {
    return new Promise(
        function(resolve, reject) {
            shell.exec(cmd, (code) => {
                if(code !== 0) {
                    reject(rejectMessage);
                }

                resolve();
            });
        }
    );
}
