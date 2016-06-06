import {provide} from '@angular/core';
import {Http, BaseRequestOptions} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {Observable} from 'rxjs/Observable';
import {beforeEachProviders, beforeEach, describe, expect, inject, it} from '@angular/core/testing';

import {TestUtils} from '../tests/test-utils';
import {VenuesService} from './venues';
import {getVenues} from '../tests/example-data-venues';

const testUtils = new TestUtils();

describe('VenuesService', () => {
    const providers = [
        provide(
            VenuesService,
            {
                useFactory: (backend) => {
                    const matchesService = new VenuesService(backend);

                    spyOn(matchesService, 'load').and.callThrough();

                    return matchesService;
                },
                deps: [Http],
            }
        ),
        MockBackend,
        BaseRequestOptions,
        provide(
            Http,
            {
                useFactory: (backend, options) => {
                    const _http = new Http(backend, options);

                    spyOn(_http, 'get').and.callThrough();

                    return _http;
                },
                deps: [MockBackend, BaseRequestOptions],
            }
        ),
    ];

    beforeEachProviders(() => providers);

    beforeEach(testUtils.generateMockBackend(true, {body: getVenues()}));

    it('should be constructed', inject([VenuesService, Http], (service: VenuesService, http: Http) => {
        service.observable$.subscribe((data) => {
            expect(service.load).toHaveBeenCalled();
            expect(service.observable$).toEqual(jasmine.any(Observable));
        });
    }));

    it('load() should fetch venue data and call next on the observer', inject([
        VenuesService,
    ], (service: VenuesService) => {
        const promise = new Promise((resolve, reject) => {
            let loadCalls = 0;

            service.observable$.subscribe((data) => {
                loadCalls++;

                if(loadCalls === 1) {
                    service.load();
                }

                if(loadCalls === 2) {
                    expect(service.load).toHaveBeenCalledTimes(loadCalls);

                    expect(testUtils.mockedBackend.connectionsArray.length).toBe(2);
                    expect(testUtils.mockedBackend.connectionsArray[1].request.method).toBe(0); // GET
                    expect(testUtils.mockedBackend.connectionsArray[1].request.url).toBe('/data/venues.json');

                    resolve();
                }
            });
        });

        return promise;
    }), testUtils.standardTimeout);

    it('load() http call should handle an error response', () => {
        // Little different this spec as we're needing to overwrite the standard beforeEach so that we can instead
        // have the http call return an error.

        testUtils.resetProviders(providers);

        testUtils.generateMockBackend()();

        spyOn(console, 'error');

        const fn = inject([VenuesService], (service: VenuesService) => {
            const promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    expect(console.error).toHaveBeenCalledWith('Could not load venues.', undefined);

                    resolve();
                }, 500);

                service.observable$.subscribe((data) => {
                    reject('should not have been called');
                });
            });

            return promise;
        });

        return fn();
    }, testUtils.standardTimeout);

    it('getVenues() should return all venues', inject([VenuesService], (
        service: VenuesService
    ) => {
        service.observable$.subscribe((data) => {
            const allVenues = service.getVenues();
            let venue;

            // MCG
            venue = allVenues['MCG'];
            expect(venue).toBeDefined();
            expect(venue.fullName).toBe('Melbourne Cricket Ground');
            expect(venue.abbreviation).toBe('MCG');
            expect(venue.city).toBe('Melbourne');
            expect(venue.state).toBe('VIC');
            expect(venue.timezone).toBe('Australia/Melbourne');

            // Adelaide Oval
            venue = allVenues['AO'];
            expect(venue).toBeDefined();
            expect(venue.fullName).toBe('Adelaide Oval');
            expect(venue.abbreviation).toBe('AO');
            expect(venue.city).toBe('Adelaide');
            expect(venue.state).toBe('SA');
            expect(venue.timezone).toBe('Australia/Adelaide');

            // Spotless Stadium
            venue = allVenues['SPO'];
            expect(venue).toBeDefined();
            expect(venue.fullName).toBe('Spotless Stadium');
            expect(venue.abbreviation).toBe('SPO');
            expect(venue.city).toBe('Sydney');
            expect(venue.state).toBe('NSW');
            expect(venue.timezone).toBe('Australia/Sydney');
        });
    }));
});
