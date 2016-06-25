import 'lodash';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Venue } from '../models/index';

@Injectable()
export class VenuesService {
    observable$ : Observable<Subscriber<IVenues>>;
    private _observer : Subscriber<IVenues>;
    private _dataStore : IVenuesDataStore;

    constructor(private _http: Http) {
        this._dataStore = { venues: {} };

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
            this._dataStore.venues = data;

            _.forEach(data, (attrs, id) => {
                Venue.updateOrCreate([{key: 'id', value: id}], {
                    id: id,
                    fullName: attrs.fullName,
                    abbreviation: attrs.abbreviation,
                    city: attrs.city,
                    state: attrs.state,
                    timezone: attrs.timezone,
                });
            });

            console.log(Venue.find('AO').get('fullName'));

            this._observer.next(this._dataStore.venues);
        }, (error) => {
            console.error('Could not load venues.', error);
        });
    }

    /**
     * Returns venues in datastore
     *
     * @returns {IVenues}
     */
    getVenues() {
        return this._dataStore.venues;
    }
}
