import 'lodash';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Venue, VenueItem } from '../models/index';

//export interface IndividualVenue {
//    fullName: string;
//    abbreviation: string;
//    city: string;
//    state: string;
//    timezone: string;
//}
//
//export interface VenueList {
//    [venue: string]: Venue;
//}

@Injectable()
export class VenuesService {
    observable$ : Observable<Subscriber<VenueItem[]>>;
    private _observer : Subscriber<VenueItem[]>;
    //private _dataStore : IVenuesDataStore;

    constructor(private _http: Http) {
        //this._dataStore = { venues: {} };

        // Create Observable Stream to output our data
        this.observable$ = new Observable((observer) => {
            this._observer = observer;

            this.load();
        }).share();
    }

    /**
     * Fetch venues data and calls next on observer
     */
    load() {
        let observable = this._http.get('/data/venues.json').map(response => response.json());

        observable.subscribe(data => {
            this.updateOrCreateVenues(data);

            this._observer.next(Venue.all());
        }, (error) => {
            console.error('Could not load venues.', error);
        });
    }

    private updateOrCreateVenues(data) {
        _.forEach(data, this.updateOrCreate);
    }

    private updateOrCreate(attrs, id) {
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
     * Returns venues in datastore
     *
     * @returns {IVenues}
     */
    getVenues() {
        return Venue.all();
    }
}
