import 'lodash';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/map';

import { Team, TeamItem } from '../models/index';

/**
 * Interfaces
 */

export interface IndividualTeam {
    fullName: string;
    abbreviation: string;
    city: string;
    state: string;
}

export interface TeamList {
    [id: string]: IndividualTeam;
}

/**
 * Teams Service
 *
 * Repository and HTTP handler for teams data.
 */
@Injectable()
export class TeamsService {
    /**
     * Observable available for subscription that emits when teams data is loaded.
     */
    observable$;

    /**
     * Constructor. Http injected. Observable initialised and load called().
     *
     * @param http
     */
    constructor(private http: Http) {
        this.observable$ = new ReplaySubject(1);

        this.load();
    }

    /**
     * Fetch teams data and calls next on observer
     */
    load() : void {
        let observable = this.http.get('/data/teams.json').map(response => response.json());

        observable.subscribe(data => {
            this.updateOrCreateTeams(data);
            this.observable$.next();
        }, (error) => {
            console.error('Could not load teams.', error);
        });
    }

    /**
     * Loops venue json data and calls updateOrCreate().
     *
     * @param data
     */
    private updateOrCreateTeams(data : TeamList) : void {
        _.forEach(data, this.updateOrCreate);
    }

    /**
     * Creates new or updates existing individual team on Team Model.
     *
     * @param attrs
     * @param id
     */
    private updateOrCreate(attrs : IndividualTeam, id : string) : void {
        Team.updateOrCreate([{key: 'id', value: id}], {
            id: id,
            fullName: attrs.fullName,
            abbreviation: attrs.abbreviation,
            city: attrs.city,
            state: attrs.state,
        });
    }

    /**
     * Returns array of Team Items.
     *
     * @returns {TeamItem[]}
     */
    getTeams() : TeamItem[] {
        return Team.all();
    }
}
