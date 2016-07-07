import { provide } from '@angular/core';
import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';
import { addProviders, fakeAsync, inject, tick } from '@angular/core/testing';

import { TestUtils } from '../tests/test-utils';
import { VenuesService } from './index';
import { Venue, VenueItem } from '../models/index';
import { getVenues } from '../tests/example-data-venues';

const testUtils = new TestUtils();

const seededVenues = getVenues();

describe('VenuesService', () => {
    const providers = [
        provide(
            VenuesService,
            {
                useFactory: (backend) => {
                    spyOn(VenuesService.prototype, 'load').and.callThrough();

                    return new VenuesService(backend);
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
        provide(
            Venue,
            {
                useFactory: () => Venue,
                deps: [],
            }
        ),
    ];

    beforeEach(() => {
        addProviders(providers);

        testUtils.generateMockBackend(true, {body: seededVenues})();

        spyOn(console, 'error');
    });

    it('should be constructed', inject([VenuesService, Http], (service: VenuesService, http: Http) => {
        expect(VenuesService.prototype.load).toHaveBeenCalled();
        expect(service.observable$).toEqual(jasmine.any(Observable));
    }));

    it('load() should fetch venue data, update Venue Model and call next on the observer', () => {
        spyOn(Venue, 'updateOrCreate').and.callThrough();

        inject([
            VenuesService,
            Venue,
        ], (service: VenuesService) => {
            service.observable$.subscribe((data) => {
                expect(service.load).toHaveBeenCalledTimes(1);

                expect(testUtils.mockedBackend.connectionsArray.length).toBe(1);
                expect(testUtils.mockedBackend.connectionsArray[0].request.method).toBe(0); // GET
                expect(testUtils.mockedBackend.connectionsArray[0].request.url).toBe('/data/venues.json');

                expect(Venue.updateOrCreate).toHaveBeenCalledTimes(Object.keys(seededVenues).length);
            });
        })();
    });

    it('load() http call should handle an error response', fakeAsync(() => {
        testUtils.resetProviders(providers);

        testUtils.generateMockBackend()();

        inject([VenuesService], (service: VenuesService) => {
            tick(500);
            expect(console.error).toHaveBeenCalledWith('Could not load venues.', undefined);
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
