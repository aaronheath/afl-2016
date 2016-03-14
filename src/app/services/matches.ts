import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import {loopMatches} from '../helpers/matches'

@Injectable()
export class MatchesService {
    observable$;
    private _observer;
    private _dataStore;

    constructor(private _http: Http) {
        this._dataStore = { matches: {} };

        this.observable$ = new Observable((observer) => {
            this._observer = observer
        }).share();

        this.load();
    }

    load() {
        let observable = this._http.get('/data/matches.json').map(response => response.json());

        observable.subscribe(data => {
            this._dataStore.matches = this._calculateAttrs(data);
            this._observer.next(this._dataStore.matches);
        }, (error) => {
            console.error('Could not load matches.', error)
        });
    }

    private _calculateAttrs(data) {
        return loopMatches(data, (match) => {
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
        });
    }

    getAllMatches() {
        return this._dataStore.matches;
    }
}
