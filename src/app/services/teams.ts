import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import TeamModel from '../models/team';
import 'lodash';

@Injectable()
export class TeamsService {
    observable$ : Observable<Subscriber<ITeams>>;
    private _observer : Subscriber<ITeams>;
    private _dataStore : ITeamsDataStore;

    constructor(private _http: Http) {
        this._dataStore = { teams: {} };

        this.observable$ = new Observable((observer) => {
            this._observer = observer;

            this.load();
        }).share();
    }

    /**
     * Fetch teams data and calls next on observer
     */
    load() : void {
        let observable = this._http.get('/data/teams.json').map(response => response.json());

        observable.subscribe(data => {
            this._dataStore.teams = data;

            _.forEach(data, (attrs, id) => {
                TeamModel.updateOrCreate([{key: 'id', value: id}], {
                    id: id,
                    fullName: attrs.fullName,
                    abbreviation: attrs.abbreviation,
                    city: attrs.city,
                    state: attrs.state,
                });
            });

            console.log(TeamModel.find('ESS').get('fullName'));

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
