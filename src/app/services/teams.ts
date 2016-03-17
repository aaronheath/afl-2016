import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

@Injectable()
export class TeamsService {
    observable$;
    private _observer;
    private _dataStore;

    constructor(private _http: Http) {
        this._dataStore = { teams: {} };

        this.observable$ = new Observable((observer) => {
            this._observer = observer
        }).share();

        this.load();
    }

    load() {
        let observable = this._http.get('/data/teams.json').map(response => response.json());

        observable.subscribe(data => {
            this._dataStore.teams = data;
            this._observer.next(this._dataStore.teams);
        }, (error) => {
            console.error('Could not load teams.', error)
        });
    }

    getTeams() {
        return this._dataStore.teams;
    }
}
