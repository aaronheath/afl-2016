import { Injectable } from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

@Injectable()
export class VenuesService {
    observable$;
    private _observer;
    private _dataStore;

    constructor(private _http: Http) {
        this._dataStore = { venues: {} };

        // Create Observable Stream to output our data
        this.observable$ = new Observable((observer) => {
            this._observer = observer
        }).share();

        this.load();
    }

    load() {
        let observable = this._http.get('/data/venues.json').map(response => response.json());

        observable.subscribe(data => {
            this._dataStore.venues = data;
            this._observer.next(this._dataStore.venues);
        }, (error) => {
            console.error('Could not load venues.', error)
        });
    }

    getVenues() {
        return this._dataStore.venues;
    }
}
