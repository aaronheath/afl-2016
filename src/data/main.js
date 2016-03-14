const fs = require('fs');
const matches = require('./matches');
const teams = require('./teams');
const venues = require('./venues');

const outputs = [
    {
        filename: 'matches.json',
        content: JSON.stringify(matches),
    },
    {
        filename: 'teams.json',
        content: JSON.stringify(teams),
    },
    {
        filename: 'venues.json',
        content: JSON.stringify(venues),
    },
];

const publicDataDir = __dirname + '/../../public/data/';

outputs.forEach(function(output) {
    fs.writeFile(publicDataDir + output.filename, output.content);
});
