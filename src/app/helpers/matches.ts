import {loopObj, getDatastoreAttr, copy} from './utils';

declare const moment;

/**
 * Parses provided matches and adds calculated attributes using matches, team and venues data.
 *
 * @param matches
 * @param teams
 * @param venues
 * @returns {IMatches}
 */
function generateMatches(matches : IMatches, teams : ITeams, venues : IVenues, timezone : ITimezone) : IMatches {
    const _matches = copy(matches);

    return _addAttrs(_matches, teams, venues, timezone);
}

/**
 * Adds calculated attributes
 *
 * Attributes:
 * - h_home: Full name of the home team
 * - h_away: Full name of the away team
 * - h_venue: Full name of the venue
 * - venue_moment: Moment (momentjs) of match start time in the venues local time
 * - local_moment: Moment (momentjs) of match start time in the users local time
 * - local_datetime: String datetime of match start time
 * - h_date: Date of the match
 * - h_venue_time: Human readable match start time in the venue local time
 * - h_local_time: Human readable match start time in the users local time
 *
 * @param matches
 * @param teams
 * @param venues
 * @returns {IMatches}
 * @private
 */
function _addAttrs(matches : IMatches, teams : ITeams, venues : IVenues, timezone : ITimezone) : IMatches {
    return loopMatches(matches, (match) => {
        match.h_home = getDatastoreAttr(teams, match.home, 'fullName');
        match.h_home_abbr = getDatastoreAttr(teams, match.home, 'abbreviation');
        match.h_away = getDatastoreAttr(teams, match.away, 'fullName');
        match.h_away_abbr = getDatastoreAttr(teams, match.away, 'abbreviation');

        match.h_venue = getDatastoreAttr(venues, match.venue, 'fullName');
        match.h_venue_abbr = getDatastoreAttr(venues, match.venue, 'abbreviation');

        match.venue_moment = moment.tz(
            `${match.date}/2016 ${match.time}`,
            'D/M/YYYY HH:mm',
            getDatastoreAttr(venues, match.venue, 'timezone')
        );

        match.local_moment = match.venue_moment.clone().tz(timezone);
        match.local_datetime = match.local_moment.format('YYYY-MM-DD HH:mm:ss');

        match.h_date = match.venue_moment.format('ddd D MMM');
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
function loopMatches(data : IMatches, callback : Function) : IMatches {
    return loopObj(data, (round) => {
        return round.map((match, i) => {
            return callback(match);
        });
    });
}

export {
    generateMatches,
    loopMatches,
};
