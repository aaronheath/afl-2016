import { Item, Team, Venue } from './index';

declare const moment;

export class MatchItem extends Item {
    homePoints() {
        return this.points('home');
    }

    awayPoints() {
        return this.points('away');
    }

    private points(team) {
        const goals = this.get(`${team}Goals`);
        const behinds = this.get(`${team}Behinds`);

        if(_.isUndefined(goals) || _.isUndefined(behinds)) {
            return;
        }

        return goals * 6 + behinds;
    }

    margin() {
        const home = this.homePoints();
        const away = this.awayPoints();

        if(_.isUndefined(home) || _.isUndefined(away)) {
            return;
        }

        return Math.abs(home - away);
    }

    result() {
        const home = this.homePoints();
        const away = this.awayPoints();

        if(_.isUndefined(home) || _.isUndefined(away)) {
            return;
        }

        if(home > away) {
            return this.get('home');
        }

        if(home < away) {
            return this.get('away');
        }

        return 'DRAW';
    }

    home() {
        return this.team('home');
    }

    away() {
        return this.team('away');
    }

    private team(attr) {
        return Team.find(this.get(attr));
    }

    venue() {
        return Venue.find(this.get('venue'));
    }

    date(format = 'ddd D MMM', timezone?) {
        return this.moment().format(format);
    }

    time(format = 'HH:mm') {
        return this.moment().format(format);
    }

    timeTz(timezone, format = 'HH:mm') {
        return this.moment().clone().tz(timezone).format(format);
    }

    private moment() {
        return moment.tz(
            `${this.get('date')}/2016 ${this.get('time')}`,
            'D/M/YYYY HH:mm',
            this.venue().get('timezone')
        );
    }
}
