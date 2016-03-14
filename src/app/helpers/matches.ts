import {loopObj, getDatastoreAttr} from './utils';

declare const moment;

function generateMatches(matches, teams, venues) {
    const _matches = Object.assign({}, matches);

    return _addAttrs(_matches, teams, venues);
}

function _addAttrs(matches, teams, venues) {
    return loopMatches(matches, (match) => {
        match.h_home = getDatastoreAttr(teams, match.home, 'fullName');
        match.h_away = getDatastoreAttr(teams, match.away, 'fullName');

        match.h_venue = getDatastoreAttr(venues, match.venue, 'fullName');

        match.venue_moment = moment.tz(
            `${match.date}/2016 ${match.time}`,
            'D/M/YYYY HH:mm',
            getDatastoreAttr(venues, match.venue, 'timezone')
        );

        match.local_moment = match.venue_moment.clone().tz('Australia/Adelaide');
        match.local_datetime = match.local_moment.format('YYYY-MM-DD HH:mm:ss');

        match.h_date = match.venue_moment.format('ddd D MMM');
        match.h_venue_time = match.venue_moment.format('HH:mm');
        match.h_local_time = match.local_moment.format('HH:mm');
    });
}

function loopMatches(data, callback) {
    return loopObj(data, (round) => {
        round.forEach((match) => {
            callback(match);
        });
    });
}

export {generateMatches, loopMatches};
