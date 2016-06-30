import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

/**
 * Readme Service
 *
 * Repository and HTTP handler for readme content.
 */
@Injectable()
export class ReadmeService {
    /**
     * Observable available for subscription that emits when readme is loaded.
     */
    observable$ : Observable<Subscriber<string>>;

    /**
     * Observer for observable$ subscription.
     */
    private _observer : Subscriber<string>;

    /**
     * Store for readme content.
     */
    private store : string = '';

    constructor(private _http: Http) {
        //this.store = { readme: '' };

        // Create Observable Stream to output our data
        this.observable$ = new Observable((observer) => {
            this._observer = observer;

            this.load();
        }).share();
    }

    /**
     * Fetch readme.md and calls next on observer with the content of the readme.
     */
    load() {
        let observable = this._http.get('/data/README.md').map(response => response.text());

        observable.subscribe(data => {
            this.store = data;

            this._observer.next(this.store);
        }, (error) => {
            console.error('Could not load readme.', error);
        });
    }

    /**
     * Returns readme content.
     *
     * @returns {string}
     */
    getReadme() {
        return this.store;
    }
}
