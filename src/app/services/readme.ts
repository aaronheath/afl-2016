import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ReplaySubject } from 'rxjs/ReplaySubject';
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
    observable$;

    /**
     * Store for readme content.
     */
    private store : string = '';

    constructor(private _http: Http) {
        this.observable$ = new ReplaySubject(1);

        this.load();
    }

    /**
     * Fetch readme.md and calls next on observer with the content of the readme.
     */
    load() {
        let observable = this._http.get('/data/README.md').map(response => response.text());

        observable.subscribe(data => {
            this.store = data;
            this.observable$.next(this.store);
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
