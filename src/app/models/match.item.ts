import Moment = moment.Moment;

import { Item, Team, TeamItem, Venue, VenueItem } from './index';

declare const moment;

/**
 * MatchItem utilised with MatchModel
 */
export class MatchItem extends Item {
    /**
     * Points scored by home team.
     *
     * @returns {number}
     */
    homePoints() : number {
        return this.points('home');
    }

    /**
     * Points scored by away team.
     *
     * @returns {number}
     */
    awayPoints() : number {
        return this.points('away');
    }

    /**
     * Returns points scored by team depending on team arg. Undefined if match not played.
     *
     * @param team
     * @returns {any}
     */
    protected points(team : 'home' | 'away') : number {
        const goals = this.get(`${team}Goals`);
        const behinds = this.get(`${team}Behinds`);

        if(_.isUndefined(goals) || _.isUndefined(behinds)) {
            return;
        }

        return goals * 6 + behinds;
    }

    /**
     * Points margin of result. Undefined if match not played.
     *
     * @returns {number}
     */
    margin() : number {
        const home = this.homePoints();
        const away = this.awayPoints();

        if(_.isUndefined(home) || _.isUndefined(away)) {
            return;
        }

        return Math.abs(home - away);
    }

    /**
     * Id of winning team or DRAW if match was drawn. Undefined if match not played.
     *
     * @returns {any}
     */
    result() : string {
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

    /**
     * TeamItem of home team.
     *
     * @returns {TeamItem}
     */
    home() : TeamItem {
        return this.team('home');
    }

    /**
     * TeamItem of away team.
     *
     * @returns {TeamItem}
     */
    away() : TeamItem {
        return this.team('away');
    }

    /**
     * TeamItem for key with Id: attr
     *
     * @param attr
     * @returns {Item}
     */
    protected team(attr : string) : TeamItem {
        return Team.find(this.get(attr));
    }

    /**
     * VenueItem of venue.
     *
     * @returns {Item}
     */
    venue() : VenueItem {
        return Venue.find(this.get('venue'));
    }

    /**
     * Date of match. Defaults to 'Sun 26 Jul' format.
     *
     * @param format
     * @returns {string}
     */
    date(format : string = 'ddd D MMM') : string {
        return this.moment().format(format);
    }

    /**
     * Time of match. Defaults to '16:45' format.
     *
     * @param format
     * @returns {string}
     */
    time(format : string = 'HH:mm') : string {
        return this.moment().format(format);
    }

    /**
     * Date and / or time of match for given timezone. Defaults to '16:45' format. It's possible to include the date
     * of the timezone selected should the format string reflect this desire.
     *
     * @param timezone
     * @param format
     * @returns {string}
     */
    timeTz(timezone : string, format : string = 'HH:mm') : string {
        return this.moment().clone().tz(timezone).format(format);
    }

    /**
     * Generates moment.js 'moment' for the matches start time.
     *
     * @returns {string|Moment|any}
     */
    private moment() : Moment {
        return moment.tz(
            `${this.get('date')}/2016 ${this.get('time')}`,
            'D/M/YYYY HH:mm',
            this.venue().get('timezone')
        );
    }
}
