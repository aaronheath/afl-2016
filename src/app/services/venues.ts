import 'lodash';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Venue, VenueItem } from '../models/index';

/**
 * Interfaces
 */

export interface IndividualVenue {
    fullName: string;
    abbreviation: string;
    city: string;
    state: string;
    timezone: string;
}

export interface VenueList {
    [id: string]: IndividualVenue;
}

/**
 * Venues Service
 *
 * Repository and HTTP handler for venue data.
 */
@Injectable()
export class VenuesService {
    /**
     * Observable available for subscription that emits when venue data is loaded.
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
     * Fetch venues data and calls next on observer
     */
    load() : void {
        let observable = this.http.get('/data/venues.json').map(response => response.json());

        observable.subscribe(data => {
            this.updateOrCreateVenues(data);

            this.observable$.next();
        }, (error) => {
            console.error('Could not load venues.', error);
        });
    }

    /**
     * Loops venue json data and calls updateOrCreate().
     *
     * @param data
     */
    private updateOrCreateVenues(data : VenueList) : void {
        _.forEach(data, this.updateOrCreate);
    }

    /**
     * Creates new or updates existing individual venue on Venue Model.
     *
     * @param attrs
     * @param id
     */
    private updateOrCreate(attrs : IndividualVenue, id : string) : void {
        Venue.updateOrCreate([{key: 'id', value: id}], {
            id: id,
            fullName: attrs.fullName,
            abbreviation: attrs.abbreviation,
            city: attrs.city,
            state: attrs.state,
            timezone: attrs.timezone,
        });
    }

    /**
     * Returns array of Venue Items.
     *
     * @returns {VenueItem[]}
     */
    getVenues() : VenueItem[] {
        return Venue.all();
    }
}
