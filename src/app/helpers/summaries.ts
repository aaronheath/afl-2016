import 'lodash';
import {loopObj} from './utils';

/**
 * Returns statistical summaries for various aspects of the season. Currently they are:
 * - A summary of each regular season round
 *
 * @param matches
 * @returns {{rounds: IRoundSummaries}}
 */
function generateSummaries(matches : IMatches) : ISummaries {
    return {
        rounds: _summaryOfRounds(matches),
    };
}

/**
 * Returns a summary of each regular season round
 *
 * @param matches
 * @returns {IBasicObj}
 * @private
 */
function _summaryOfRounds(matches : IMatches) : IRoundSummaries {
    return loopObj(matches, (_matches) => {
        const roundSummary : IRoundSummary = {
            accuracy: 0,
            attendance: 0,
            behinds: 0,
            goals: 0,
            highestAttendance: [],
            highestScore: [],
            lowestAttendance: [],
            lowestScore: [],
            matchPlayed: false,
            totalPoints: 0,
        };

        _matches.forEach((match) => {
            if(typeof match.result === 'undefined') {
                return;
            }

            if(!roundSummary.matchPlayed) {
                roundSummary.matchPlayed = true;
            }

            roundSummary.goals += match.homeGoals + match.awayGoals;
            roundSummary.behinds += match.homeBehinds + match.awayBehinds;
            roundSummary.attendance += match.attendance;

            roundSummary.highestScore = _generateHighestScore(roundSummary.highestScore, match);
            roundSummary.lowestScore = _generateLowestScore(roundSummary.lowestScore, match);

            roundSummary.highestAttendance = _generateHighestAttendance(roundSummary.highestAttendance, match);
            roundSummary.lowestAttendance = _generateLowestAttendance(roundSummary.lowestAttendance, match);
        });

        roundSummary.totalPoints = roundSummary.goals * 6 + roundSummary.behinds;
        roundSummary.accuracy = roundSummary.goals / (roundSummary.goals + roundSummary.behinds) * 100;

        return roundSummary;
    });
}

/**
 * Compares supplied match against the current highest attendance figure. Returns the higher value.
 *
 * @param highestAttendance
 * @param match
 * @returns {any}
 * @private
 */
function _generateHighestAttendance(highestAttendance : IMatch[], match : IMatch) : IMatch[] {
    if(_.isEmpty(highestAttendance)) {
        return [match];
    }

    const _highestAttendance = _.clone(highestAttendance);

    if(_highestAttendance[0].attendance < match.attendance) {
        return [match];
    }

    if(_highestAttendance[0].attendance === match.attendance) {
        _highestAttendance.push(match);
    }

    return _highestAttendance;
}

/**
 * Compares supplied match against the current lowest attendance figure. Returns the lower value.
 *
 * @param lowestAttendance
 * @param match
 * @returns {any}
 * @private
 */
function _generateLowestAttendance(lowestAttendance : IMatch[], match : IMatch) : IMatch[] {
    if(_.isEmpty(lowestAttendance)) {
        return [match];
    }

    const _lowestAttendance = _.clone(lowestAttendance);

    if(_lowestAttendance[0].attendance > match.attendance) {
        return [match];
    }

    if(_lowestAttendance[0].attendance === match.attendance) {
        _lowestAttendance.push(match);
    }

    return _lowestAttendance;
}

/**
 * Compares supplied match against the current highest score matches array. Returns array with match(es) with the
 * highest score.
 *
 * @param highestScore
 * @param match
 * @returns {any}
 * @private
 */
function _generateHighestScore(highestScore : IMatch[], match : IMatch) : IMatch[] {
    if(_.isEmpty(highestScore)) {
        return [match];
    }

    const _highestScore = _.clone(highestScore);

    const highScore = match.homePoints > match.awayPoints ? match.homePoints : match.awayPoints;

    if(_highestScore[0].homePoints < highScore && _highestScore[0].awayPoints < highScore) {
        return [match];
    }

    if(_highestScore[0].homePoints === highScore && _highestScore[0].awayPoints === highScore) {
        _highestScore.push(match);
    }

    return _highestScore;
}

/**
 * Compares supplied match against the current lowest score matches array. Returns array with match(es) with the
 * lowest score.
 *
 * @param lowestScore
 * @param match
 * @returns {any}
 * @private
 */
function _generateLowestScore(lowestScore : IMatch[], match : IMatch) : IMatch[] {
    if(_.isEmpty(lowestScore)) {
        return [match];
    }

    const _lowestScore = _.clone(lowestScore);

    const lowScore = match.homePoints > match.awayPoints ? match.awayPoints : match.homePoints;

    if(_lowestScore[0].homePoints > lowScore && _lowestScore[0].awayPoints > lowScore) {
        return [match];
    }

    if(_lowestScore[0].homePoints === lowScore && _lowestScore[0].awayPoints === lowScore) {
        _lowestScore.push(match);
    }

    return _lowestScore;
}

export {
    generateSummaries,
};
