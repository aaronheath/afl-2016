declare const moment;

const matches : IMatch[] = [
    {
        h_home: 'Essendon',
        result: 'ESS',
        home: 'ESS',
        homeGoals: 15,
        homeBehinds: 10,
        homePoints: 100,
        away: 'ADL',
        awayGoals: 14,
        awayBehinds: 11,
        awayPoints: 95,
        venue: 'MCG',
        h_venue: 'Melbourne Cricket Ground',
        attendance: 56482,
        h_home_abbr: 'ESS',
        h_away_abbr: 'ADL',
        date: '26/7',
        time: '13:15',
    },
    {
        h_home: 'Port Adelaide',
        result: 'PA',
        home: 'PA',
        homeGoals: 19,
        homeBehinds: 13,
        homePoints: 127,
        away: 'COLL',
        awayGoals: 3,
        awayBehinds: 21,
        awayPoints: 39,
        venue: 'AO',
        h_venue: 'Adelaide Oval',
        attendance: 34561,
        h_home_abbr: 'PA',
        h_away_abbr: 'COLL',
        date: '27/7',
        time: '14:40',
    },
];

const venueTimezones = {
    AO: 'Australia/Adelaide',
    MCG: 'Australia/Melbourne',
};

const timezone = 'Australia/Adelaide';

function _assignTimes() {
    return matches.map((match, i) => {
        match.venue_moment = moment.tz(
            `${match.date}/2016 ${match.time}`,
            'D/M/YYYY HH:mm',
            venueTimezones[match.venue]
        );

        match.h_date = match.venue_moment.format('ddd D MMM');

        match.local_moment = match.venue_moment.clone().tz(timezone);
        match.local_datetime = match.local_moment.format('YYYY-MM-DD HH:mm:ss');

        match.h_venue_time = match.venue_moment.format('HH:mm');
        match.h_local_time = match.local_moment.format('HH:mm');

        return match;
    });
}

function getMatches() {
    return _assignTimes();
}

export {
    getMatches,
};
