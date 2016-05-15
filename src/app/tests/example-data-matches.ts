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
    //{
    //    h_home: 'Port Adelaide',
    //    result: 'ESS',
    //    home: 'PA',
    //    homeGoals: 8,
    //    homeBehinds: 7,
    //    homePoints: 55,
    //    away: 'ESS',
    //    awayGoals: 19,
    //    awayBehinds: 13,
    //    awayPoints: 127,
    //    h_venue: 'Adelaide Oval',
    //    attendance: 49986,
    //    venue: 'AP',
    //    h_home_abbr: 'PA',
    //    h_away_abbr: 'ESS',
    //    date: '',
    //    time: '',
    //},
    //{
    //    h_date: 'Wed 27 Jul',
    //    h_home: 'ADL',
    //    result: 'ADL',
    //    home: 'ADL',
    //    homeGoals: 6,
    //    homeBehinds: 9,
    //    homePoints: 45,
    //    away: 'PA',
    //    awayGoals: 5,
    //    awayBehinds: 3,
    //    awayPoints: 33,
    //    h_venue: 'Adelaide Oval',
    //    attendance: 56482,
    //    venue: 'AO',
    //    h_home_abbr: 'ADL',
    //    h_away_abbr: 'PA',
    //    date: '',
    //    time: '',
    //},
];

const venueTimezones = {
    AO: 'Australia/Adelaide',
    MCG: 'Australia/Melbourne',
};

const timezone = 'Australia/Adelaide';

function _assignTimes() {
    //const times = [
    //    moment.tz(`26/7/2016 13:15`, 'D/M/YYYY HH:mm', 'Australia/Melbourne'),
    //    moment.tz(`25/7/2016 19:10`, 'D/M/YYYY HH:mm', 'Australia/Adelaide'),
    //    moment.tz(`27/7/2016 12:40`, 'D/M/YYYY HH:mm', 'Australia/Adelaide'),
    //];

    return matches.map((match, i) => {
        //match.date = times[i].format('D/M');
        //match.time = times[i].format('HH:mm');
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
