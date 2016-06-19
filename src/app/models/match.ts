import {Model} from './model';
import {Item} from './item';
import TeamModel from './team';
import VenueModel from './venue';

declare const moment;

class MatchItem extends Item {
    public homePoints()  {
        return this.points('home');
    }

    public awayPoints()  {
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

    public margin() {
        const home = this.homePoints();
        const away = this.awayPoints();

        if(_.isUndefined(home) || _.isUndefined(away)) {
            return;
        }

        return Math.abs(home - away);
    }

    public result() {
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

    public home() {
        return this.team('home');
    }

    public away() {
        return this.team('away');
    }

    private team(attr) {
        return TeamModel.find(this.get(attr));
    }

    public venue() {
        return VenueModel.find(this.get('venue'));
    }

    public date(format = 'ddd D MMM', timezone?) {
        return this.moment().format(format);
    }

    public time(format = 'HH:mm') {
        return this.moment().format(format);
    }

    public timeTz(timezone, format = 'HH:mm') {
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

class MatchModel extends Model {
    protected fillable = [
        'home',
        'homeGoals',
        'homeBehinds',
        'away',
        'awayGoals',
        'awayBehinds',
        'venue',
        'date',
        'time',
        'attendance',
        'roundNo',
    ];
}

const model = new MatchModel(MatchItem);

export default model;
