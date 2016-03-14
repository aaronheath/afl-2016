import {loopObj, objectToArray, getDatastoreAttr, copy} from './utils';
import {loopMatches} from './matches';

function generateLadder(teams, matches) {
    const _matches = copy(matches);

    const ladderObj = _initLadder(teams);

    if(!ladderObj) {
        return [];
    }

    _parseMatches(ladderObj, _matches);

    _parseLadder(ladderObj, teams);

    const ladder = objectToArray(ladderObj);

    return _sortLadder(ladder);
}

function _initLadder(teams) {
    if(!Object.keys(teams).length) {
        return false;
    }

    const response = {};

    loopObj(teams, (data, key) => {
        response[key] = {
            wins: 0,
            losses: 0,
            draws: 0,
            goalsFor: 0,
            behindsFor: 0,
            goalsAgainst: 0,
            behindsAgainst: 0,
        };
    });

    return response;
}

function _parseMatches(ladderObj, matches) {
    loopMatches(matches, (match) => {
        if(typeof match.result === 'undefined') {
            return;
        }

        // Increment Win/Loss/Draw
        if(match.result === match.home) {
            ladderObj[match.home].wins += 1;
            ladderObj[match.away].losses += 1;
        } else if(match.result === match.away) {
            ladderObj[match.home].losses += 1;
            ladderObj[match.away].wins += 1;
        } else {
            ladderObj[match.home].draws += 1;
            ladderObj[match.away].draws += 1;
        }

        // Increment Game Points
        ladderObj[match.home].goalsFor += match.homeGoals;
        ladderObj[match.home].goalsAgainst += match.awayGoals;
        ladderObj[match.home].behindsFor += match.homeBehinds;
        ladderObj[match.home].behindsAgainst += match.awayBehinds;

        ladderObj[match.away].goalsFor += match.awayGoals;
        ladderObj[match.away].goalsAgainst += match.homeGoals;
        ladderObj[match.away].behindsFor += match.awayBehinds;
        ladderObj[match.away].behindsAgainst += match.homeBehinds;
    });
}

function _parseLadder(ladderObj, teams) {
    loopObj(ladderObj, (data, team) => {
        ladderObj[team].h_name = getDatastoreAttr(teams, team, 'fullName');

        ladderObj[team].played = ladderObj[team].wins + ladderObj[team].losses + ladderObj[team].draws;

        ladderObj[team].pointsFor = ladderObj[team].goalsFor * 6 + ladderObj[team].behindsFor;
        ladderObj[team].pointsAgainst = ladderObj[team].goalsAgainst * 6 + ladderObj[team].behindsAgainst;

        const percentage = Math.round((ladderObj[team].pointsFor / ladderObj[team].pointsAgainst) * 10000) / 100;
        ladderObj[team].percentage = Number.isNaN(percentage) ? 0 : percentage;

        ladderObj[team].points = ladderObj[team].wins * 4 + ladderObj[team].draws * 2;
    });
}

function _sortLadder(ladder) {
    ladder.sort((a, b) => {
        let compare;

        // Compare points
        compare = b.points - a.points;

        if(compare !== 0) {
            return compare;
        }

        // Compare percentage
        compare = b.percentage - a.percentage;

        if(compare !== 0) {
            return compare;
        }

        // Compare pointsFor
        compare = b.pointsFor - a.pointsFor;

        if(compare !== 0) {
            return compare;
        }

        // Compare name
        return a.h_name.localeCompare(b.h_name);
    });

    return ladder;
}

export {generateLadder};
