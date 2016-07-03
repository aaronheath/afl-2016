import {provide} from '@angular/core';
import {Http, BaseRequestOptions} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {Observable} from 'rxjs/Observable';
import {addProviders, inject, async} from '@angular/core/testing';

import {TestUtils} from '../tests/test-utils';
import {VenuesService} from './venues';
import {getVenues} from '../tests/example-data-venues';
import {VenueItem} from '../models/index';

const testUtils = new TestUtils();

const seededVenues = getVenues();

describe('VenuesService', () => {
    const providers = [
        provide(
            VenuesService,
            {
                useFactory: (backend) => {
                    const service = new VenuesService(backend);

                    spyOn(service, 'load').and.callThrough();

                    return service;
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

    //beforeEachProviders(() => providers);
    //
    //beforeEach(testUtils.generateMockBackend(true, {body: seededVenues}));

    beforeEach(() => {
        addProviders(providers);

        testUtils.generateMockBackend(true, {body: seededVenues})();
    });

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

    //it('load() http call should handle an error response', () => {
    //    // Little different this spec as we're needing to overwrite the standard beforeEach so that we can instead
    //    // have the http call return an error.
    //
    //    testUtils.resetProviders(providers);
    //
    //    testUtils.generateMockBackend()();
    //
    //    spyOn(console, 'error');
    //
    //    const fn = inject([VenuesService], (service: VenuesService) => {
    //        const promise = new Promise((resolve, reject) => {
    //            setTimeout(() => {
    //                expect(console.error).toHaveBeenCalledWith('Could not load venues.', undefined);
    //
    //                resolve();
    //            }, 500);
    //
    //            service.observable$.subscribe((data) => {
    //                reject('should not have been called');
    //            });
    //        });
    //
    //        return promise;
    //    });
    //
    //    return fn();
    //}, testUtils.standardTimeout);

    it('load() http call should handle an error response', async(() => {
        testUtils.resetProviders(providers);

        testUtils.generateMockBackend()();

        spyOn(console, 'error');

        const promise = new Promise((resolve) => {
            setTimeout(() => resolve(), 500);
        });

        inject([VenuesService], (service: VenuesService) => {
            service.observable$.subscribe(() => {
                //
            });

            promise.then(() => {
                expect(console.error).toHaveBeenCalledWith('Could not load venues.', undefined);
            });
        })();
    }));

    it('getVenues() should array of all venues as VenueItem\'s', inject([VenuesService], (
        service: VenuesService
    ) => {
        service.observable$.subscribe(() => {
            const venues = service.getVenues();

            venues.forEach((item) => {
                expect(item).toEqual(jasmine.any(VenueItem));
            });

            // Match the second game
            const item = venues[3];
            const seeded = seededVenues.SCG;

            expect(item.get('fullName')).toBe(seeded.fullName);
            expect(item.get('abbreviation')).toBe(seeded.abbreviation);
            expect(item.get('city')).toBe(seeded.city);
            expect(item.get('state')).toBe(seeded.state);
            expect(item.get('timezone')).toBe(seeded.timezone);
        });
    }));
});
