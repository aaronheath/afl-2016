declare const moment;

//import {loopMatches} from '../helpers/matches';
import { getVenues } from './example-data-venues';
import { loopObj } from '../helpers/utils';

const timezone = 'Australia/Adelaide';

const matches = {
    1: [
        {
            home: 'RICH',
            homeGoals: 14,
            homeBehinds: 8,
            away: 'CARL',
            awayGoals: 12,
            awayBehinds: 11,
            venue: 'MCG',
            date: '24/3',
            time: '19:20',
            attendance: 75706,
        },
        {
            home: 'MEL',
            homeGoals: 12,
            homeBehinds: 8,
            away: 'GWS',
            awayGoals: 10,
            awayBehinds: 18,
            venue: 'MCG',
            date: '26/3',
            time: '13:40',
            attendance: 28505,
        },
        {
            home: 'GC',
            homeGoals: 17,
            homeBehinds: 19,
            away: 'ESS',
            awayGoals: 9,
            awayBehinds: 6,
            venue: 'MS',
            date: '26/3',
            time: '15:35',
            attendance: 16239,
        },
        {
            home: 'NM',
            homeGoals: 16,
            homeBehinds: 11,
            away: 'ADL',
            awayGoals: 14,
            awayBehinds: 13,
            venue: 'ES',
            date: '26/3',
            time: '19:25',
            attendance: 25485,
        },
        {
            home: 'SYD',
            homeGoals: 18,
            homeBehinds: 25,
            away: 'COLL',
            awayGoals: 7,
            awayBehinds: 11,
            venue: 'SCG',
            date: '26/3',
            time: '19:25',
            attendance: 33857,
        },
        {
            home: 'WB',
            homeGoals: 15,
            homeBehinds: 13,
            away: 'FRE',
            awayGoals: 5,
            awayBehinds: 8,
            venue: 'ES',
            date: '27/3',
            time: '13:10',
            attendance: 27832,
        },
        {
            home: 'PA',
            homeGoals: 20,
            homeBehinds: 13,
            away: 'STK',
            awayGoals: 15,
            awayBehinds: 10,
            venue: 'AO',
            date: '27/3',
            time: '14:50',
            attendance: 43807,
        },
        {
            home: 'WC',
            homeGoals: 26,
            homeBehinds: 10,
            away: 'BL',
            awayGoals: 15,
            awayBehinds: 12,
            venue: 'DS',
            date: '27/3',
            time: '16:40',
            attendance: 35201,
        },
        {
            home: 'GEEL',
            homeGoals: 18,
            homeBehinds: 8,
            away: 'HAW',
            awayGoals: 12,
            awayBehinds: 14,
            venue: 'MCG',
            date: '28/3',
            time: '15:20',
            attendance: 74218,
        },
    ],
    2: [
        {
            home: 'COLL',
            homeGoals: 13,
            homeBehinds: 9,
            away: 'RICH',
            awayGoals: 12,
            awayBehinds: 14,
            venue: 'MCG',
            date: '1/4',
            time: '19:50',
            attendance: 72761,
        },
        {
            home: 'ADL',
            homeGoals: 22,
            homeBehinds: 12,
            away: 'PA',
            awayGoals: 11,
            awayBehinds: 20,
            venue: 'AO',
            date: '2/4',
            time: '13:15',
            attendance: 51585,
        },
        {
            home: 'ESS',
            //homeGoals: 11,
            //homeBehinds: 14,
            away: 'MEL',
            //awayGoals: 10,
            //awayBehinds: 7,
            venue: 'MCG',
            date: '2/4',
            time: '14:10',
            //attendance: 50424,
        },
        {
            home: 'BL',
            //homeGoals: 11,
            //homeBehinds: 17,
            away: 'NM',
            //awayGoals: 17,
            //awayBehinds: 15,
            venue: 'G',
            date: '2/4',
            time: '15:35',
            //attendance: 18021,
        },
        {
            home: 'STK',
            //homeGoals: 5,
            //homeBehinds: 6,
            away: 'WB',
            //awayGoals: 13,
            //awayBehinds: 15,
            venue: 'ES',
            date: '2/4',
            time: '19:25',
            //attendance: 37353,
        },
        {
            home: 'FRE',
            //homeGoals: 14,
            //homeBehinds: 16,
            away: 'GC',
            //awayGoals: 19,
            //awayBehinds: 12,
            venue: 'DS',
            date: '2/4',
            time: '16:40',
            //attendance: 34208,
        },
        {
            home: 'GWS',
            //homeGoals: 13,
            //homeBehinds: 11,
            away: 'GEEL',
            //awayGoals: 11,
            //awayBehinds: 10,
            venue: 'MO',
            date: '3/4',
            time: '13:10',
            //attendance: 13656,
        },
        {
            home: 'HAW',
            //homeGoals: 14,
            //homeBehinds: 15,
            away: 'WC',
            //awayGoals: 7,
            //awayBehinds: 11,
            venue: 'MCG',
            date: '3/4',
            time: '15:20',
            //attendance: 42977,
        },
        {
            home: 'CARL',
            //homeGoals: 10,
            //homeBehinds: 11,
            away: 'SYD',
            //awayGoals: 20,
            //awayBehinds: 11,
            venue: 'ES',
            date: '3/4',
            time: '16:40',
            //attendance: 33146,
        },
    ],
};

function _assignTimes(_matches) {
    const venues = getVenues();

    return loopMatches(_matches, (match) => {
        match.venue_moment = moment.tz(
            `${match.date}/2016 ${match.time}`,
            'D/M/YYYY HH:mm',
            venues[match.venue].timezone
        );

        match.h_date = match.venue_moment.format('ddd D MMM');

        match.local_moment = match.venue_moment.clone().tz(timezone);
        match.local_datetime = match.local_moment.format('YYYY-MM-DD HH:mm:ss');

        match.h_venue_time = match.venue_moment.format('HH:mm');
        match.h_local_time = match.local_moment.format('HH:mm');

        return match;
    });
}

/**
 * Provides the ability to loop through all matches in the format provided by matches.json
 *
 * @param data
 * @param callback
 * @returns {IBasicObj}
 */
function loopMatches(data, callback : Function) {
    return loopObj(data, (round) => {
        return round.map((match, i) => {
            return callback(match);
        });
    });
}

function getMatches() {
    return matches;
}

function getMatchesWithTimes(_matches?) {
    if(!_matches) {
        _matches = matches;
    }

    return _assignTimes(_matches);
}

function getMatchesWithPoints(_matches?) {
    if(!_matches) {
        _matches = matches;
    }

    return loopMatches(_matches, (match) => {
        if(match.homeGoals && match.homeBehinds && match.awayGoals && match.awayBehinds) {
            match.homePoints = match.homeGoals * 6 + match.homeBehinds;
            match.awayPoints = match.awayGoals * 6 + match.awayBehinds;

            match.margin = Math.abs(match.homePoints - match.awayPoints);

            if(match.homePoints === match.awayPoints) {
                match.result = 'DRAW';
            } else {
                match.result = (match.homePoints > match.awayPoints) ? match.home : match.away;
            }
        }

        return match;
    });
}

function getMatchesWithPointsAndTimes(_matches?) {
    if(!_matches) {
        _matches = matches;
    }

    const matchesWithTimes = getMatchesWithTimes(_matches);

    return getMatchesWithPoints(matchesWithTimes);
}

export {
    getMatches,
    getMatchesWithTimes,
    getMatchesWithPoints,
    getMatchesWithPointsAndTimes,
};
