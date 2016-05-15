import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import {loopMatches} from '../helpers/matches';

@Injectable()
export class MatchesService {
    observable$ : Observable<Subscriber<IMatches>>;
    private _observer : Subscriber<IMatches>;
    private _dataStore : IMatchesDataStore;

    constructor(private _http: Http) {
        this._dataStore = { matches: {} };

        this.observable$ = new Observable((observer) => {
            this._observer = observer;
        }).share();

        this.load();
    }

    /**
     * Fetch matches data and calls next on observer
     */
    load() : void {
        let observable = this._http.get('/data/matches.json').map(response => response.json());

        observable.subscribe(data => {
            this._dataStore.matches = this._calculateAttrs(data);
            this._observer.next(this._dataStore.matches);
        }, (error) => {
            console.error('Could not load matches.', error);
        });
    }

    /**
     * Calculates team points and result if goals and points are supplied for both teams.
     * Where a draw has occurred the result attr will be set to 'DRAW'
     *
     * @param data
     * @returns {any|({}&any)}
     * @private
     */
    private _calculateAttrs(data : IMatches) : IMatches {
        return loopMatches(data, (match : IMatch) => {
            // Calculate Points
            if(typeof match.homeGoals !== 'undefined'
                && typeof match.homeBehinds !== 'undefined'
                && typeof match.awayGoals !== 'undefined'
                && typeof match.awayBehinds !== 'undefined'
            ) {
                match.homePoints = match.homeGoals * 6 + match.homeBehinds;
                match.awayPoints = match.awayGoals * 6 + match.awayBehinds;

                match.margin = Math.abs(match.homePoints - match.awayPoints);

                // Result
                if(match.homePoints > match.awayPoints) {
                    match.result = match.home;
                } else if(match.homePoints < match.awayPoints) {
                    match.result = match.away;
                } else {
                    match.result = 'DRAW';
                }
            }

            return match;
        });
    }

    /**
     * Returns matches in datastore
     *
     * @returns {IMatches}
     */
    getAllMatches() : IMatches {
        return this._dataStore.matches;
    }
}
