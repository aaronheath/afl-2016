import 'lodash';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { Match, MatchItem } from '../models/index';

/**
 * Interface
 */

export interface MatchObject {
    home: string;
    homeGoals?: number;
    homeBehinds?: number;
    away: string;
    awayGoals?: number;
    awayBehinds?: number;
    venue: string;
    date: string;
    time: string;
    attendance?: number;
    roundNo: number;
}

/**
 * Matches Service
 *
 * Repository and HTTP handler for match data.
 */
@Injectable()
export class MatchesService {
    /**
     * Observable available for subscription that emits when match data is loaded.
     */
    observable$ : Observable<Subscriber<void>>;

    /**
     * Observer for observable$ subscription.
     */
    private observer : Subscriber<void>;

    /**
     * Constructor. Http injected. Observable initialised and load called().
     *
     * @param http
     */
    constructor(private http: Http) {
        this.observable$ = new Observable((observer) => {
            this.observer = observer;

            this.load();
        }).share();
    }

    /**
     * Fetch matches data, updates MatchModel and calls next on observer.
     */
    load() : void {
        let observable = this.http.get('/data/matches.json').map(response => response.json());

        observable.subscribe(data => {
            this.flattenRounds(data).forEach(this.updateOrCreateMatchItem);

            this.observer.next();
        }, (error) => {
            console.error('Could not load matches.', error);
        });
    }

    /**
     * Flattens data provided by matches.json in array.
     *
     * @param data
     * @returns {any}
     */
    protected flattenRounds(data) {
        return _.flatMap(data, (matches, roundNo) => {
            return matches.map((match) => this.generateMatchItemData(match, roundNo));
        });
    }

    /**
     * With match data provided by matches.json and round number that groups an array of matches, returns JS object,
     * with this data merged.
     *
     * @param match
     * @param roundNo
     * @returns {{home: string, homeGoals: number, homeBehinds: number, away: string, awayGoals: number,
     * awayBehinds: number, venue: string, date: string, time: string, attendance: number, roundNo: number}}
     */
    protected generateMatchItemData(match : MatchObject, roundNo : string) : MatchObject {
        return {
            home: match.home,
            homeGoals: match.homeGoals,
            homeBehinds: match.homeBehinds,
            away: match.away,
            awayGoals: match.awayGoals,
            awayBehinds: match.awayBehinds,
            venue: match.venue,
            date: match.date,
            time: match.time,
            attendance: match.attendance,
            roundNo: +roundNo,
        };
    }

    /**
     * Create new or updates if already exists MatchItem for individual match.
     *
     * @param match
     */
    protected updateOrCreateMatchItem(match : MatchObject) : void {
        Match.updateOrCreate([
            {key: 'roundNo', value: match.roundNo},
            {key: 'home', value: match.home},
            {key: 'away', value: match.away},
        ], match);
    }

    /**
     * Returns all matches.
     *
     * @returns {IMatches}
     */
    getAllMatches() : MatchItem[] {
        return Match.all();
    }

    /**
     * All matches from specific AFL Premiership Round.
     *
     * @param roundNo
     * @returns {any}
     */
    getByRound(roundNo : number) : MatchItem[] {
        return Match.where([{key: 'roundNo', value: +roundNo}]).get();
    }
}
