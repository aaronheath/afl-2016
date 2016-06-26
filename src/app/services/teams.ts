import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import { Team, TeamItem } from '../models/index';
import 'lodash';

@Injectable()
export class TeamsService {
    observable$ : Observable<Subscriber<TeamItem[]>>;
    private _observer : Subscriber<TeamItem[]>;

    constructor(private _http: Http) {
        //this._dataStore = { teams: {} };

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
            this.updateOrCreateTeams(data);

            this._observer.next(Team.all());
        }, (error) => {
            console.error('Could not load teams.', error);
        });
    }

    private updateOrCreateTeams(data) {
        _.forEach(data, this.updateOrCreate);
    }

    private updateOrCreate(attrs, id) {
        Team.updateOrCreate([{key: 'id', value: id}], {
            id: id,
            fullName: attrs.fullName,
            abbreviation: attrs.abbreviation,
            city: attrs.city,
            state: attrs.state,
        });
    }

    /**
     * Returns teams in datastore
     *
     * @returns {ITeams}
     */
    getTeams() : TeamItem[] {
        return Team.all();
    }
}
