import {loopObj, objectToArray, getDatastoreAttr, copy} from './utils';
import {loopMatches} from './matches';

/**
 * Generates the Ladder.
 *
 * @param teams
 * @param matches
 * @returns {any}
 */
function generateLadder(teams : ITeams, matches : IMatches) : ILadderTeam[] {
    const _matches = copy(matches);

    const ladderObj = _initLadder(teams);

    if(!Object.keys(teams).length) {
        return [];
    }

    _parseMatches(ladderObj, _matches);

    _parseLadder(ladderObj, teams);

    const ladder = objectToArray(ladderObj);

    return _sortLadder(ladder);
}

/**
 * Seed the ladderObj variable that will be used later
 *
 * @param teams
 * @returns {ILadderTeamObj}
 * @private
 */
function _initLadder(teams : ITeams) : ILadderTeamObj {
    const response : ILadderTeamObj = {};

    if(!Object.keys(teams).length) {
        return response;
    }

    loopObj(teams, (data, key) => {
        response[key] = {
            behindsAgainst: 0,
            behindsFor: 0,
            draws: 0,
            goalsAgainst: 0,
            goalsFor: 0,
            losses: 0,
            wins: 0,
        };
    });

    return response;
}

/**
 * Loops through matches and updates ladderObj depending of match results
 *
 * @param ladderObj
 * @param matches
 * @private
 */
function _parseMatches(ladderObj : ILadderTeamObj, matches : IMatches) : void {
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

/**
 * Loops through ladderObj and adds calculated attributes using data provided by _parseMatches.
 *
 * Attributes:
 * - h_name: Teams full name
 * - played: Matches played
 * - pointsFor: Points scored by team
 * - pointsAgainst: Points score against team
 * - percentage: Percentage used during ladder ordering
 *   - for / against * 100
 * - points: Points obtained by team
 *
 * @param ladderObj
 * @param teams
 * @private
 */
function _parseLadder(ladderObj : ILadderTeamObj, teams : ITeams) : void {
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

/**
 * Sorts ladder
 *
 * Teams are ranked by the AFL using the following criteria:
 *
 * 1. Most match result points
 * 2. Highest percentage
 * 3. Points scored
 *
 * If those are both equal (typically when teams are yet to play a game), we'll also sort by the teams full name in
 * ascending order.
 *
 * @param ladder
 * @returns {ILadderTeam[]}
 * @private
 */
function _sortLadder(ladder : ILadderTeam[]) : ILadderTeam[] {
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
