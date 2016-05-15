import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

@Injectable()
export class TeamsService {
    observable$ : Observable<Subscriber<ITeams>>;
    private _observer : Subscriber<ITeams>;
    private _dataStore : ITeamsDataStore;

    constructor(private _http: Http) {
        this._dataStore = { teams: {} };

        this.observable$ = new Observable((observer) => {
            this._observer = observer;
        }).share();

        this.load();
    }

    /**
     * Fetch teams data and calls next on observer
     */
    load() : void {
        let observable = this._http.get('/data/teams.json').map(response => response.json());

        observable.subscribe(data => {
            this._dataStore.teams = data;
            this._observer.next(this._dataStore.teams);
        }, (error) => {
            console.error('Could not load teams.', error);
        });
    }

    /**
     * Returns teams in datastore
     *
     * @returns {ITeams}
     */
    getTeams() : ITeams {
        return this._dataStore.teams;
    }
}
