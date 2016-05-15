import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

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
        }).share();

        this.load();
    }

    /**
     * Fetch venues data and calls next on observer
     */
    load() {
        let observable = this._http.get('/data/venues.json').map(response => response.json());

        observable.subscribe(data => {
            this._dataStore.venues = data;
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
