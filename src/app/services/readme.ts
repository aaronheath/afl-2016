import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

@Injectable()
export class ReadmeService {
    observable$ : Observable<Subscriber<string>>;
    private _observer : Subscriber<string>;
    private _dataStore : IReadmeDataStore;

    constructor(private _http: Http) {
        this._dataStore = { readme: '' };

        // Create Observable Stream to output our data
        this.observable$ = new Observable((observer) => {
            this._observer = observer;

            this.load();
        }).share();
    }

    /**
     * Fetch readme.md and calls next on observer
     */
    load() {
        let observable = this._http.get('/data/README.md')
            .map(response => response.text());

        observable.subscribe(data => {
            this._dataStore.readme = data;
            this._observer.next(this._dataStore.readme);
        }, (error) => {
            console.error('Could not load readme.', error);
        });
    }

    /**
     * Returns readme in datastore
     *
     * @returns {string}
     */
    getReadme() {
        return this._dataStore.readme;
    }
}
