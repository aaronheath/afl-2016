import { provide } from '@angular/core';
import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';
import { addProviders, fakeAsync, inject, tick } from '@angular/core/testing';

import { TestUtils } from '../tests/test-utils';
import { MatchesService } from './index';
import { Match, MatchItem } from '../models/index';
import { getMatches } from '../tests/example-data-matches';

const testUtils = new TestUtils();

const matches = getMatches();

describe('MatchesService', () => {
    const providers = [
        provide(
            MatchesService,
            {
                useFactory: (backend) => {
                    spyOn(MatchesService.prototype, 'load').and.callThrough();

                    return new MatchesService(backend);
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
            Match,
            {
                useFactory: () => Match,
                deps: [],
            }
        ),
    ];

    beforeEach(() => {
        addProviders(providers);

        testUtils.generateMockBackend(true, {body: matches})();

        spyOn(console, 'error');
    });

    it('should be constructed', inject([MatchesService, Http], (matchesService: MatchesService, http: Http) => {
        expect(MatchesService.prototype.load).toHaveBeenCalled();
        expect(matchesService.observable$).toEqual(jasmine.any(Observable));
    }));

    it('load() should fetch match data, update Match Model and call next on the observer', () => {
        spyOn(Match, 'updateOrCreate').and.callThrough();

        inject([
            MatchesService,
            Match,
        ], (matchesService: MatchesService) => {
                matchesService.observable$.subscribe((data) => {
                    expect(matchesService.load).toHaveBeenCalledTimes(1);

                    expect(testUtils.mockedBackend.connectionsArray.length).toBe(1);
                    expect(testUtils.mockedBackend.connectionsArray[0].request.method).toBe(0); // GET
                    expect(testUtils.mockedBackend.connectionsArray[0].request.url).toBe('/data/matches.json');

                    expect(Match.updateOrCreate).toHaveBeenCalledTimes(18);
                });
        })();
    });

    it('load() http call should handle an error response', fakeAsync(() => {
        testUtils.resetProviders(providers);

        testUtils.generateMockBackend()();

        inject([MatchesService], (matchesService: MatchesService) => {
            tick(500);

            expect(console.error).toHaveBeenCalledWith('Could not load matches.', undefined);
        })();
    }));

    it('getAllMatches() should array of all matches as MatchItem\'s', inject([MatchesService], (
        matchesService: MatchesService
    ) => {
        matchesService.observable$.subscribe(() => {
            const all = matchesService.getAllMatches();

            all.forEach((item) => {
                expect(item).toEqual(jasmine.any(MatchItem));
            });

            // Match the second game
            const item = all[1];
            const seeded = matches[1][1];

            expect(item.get('home')).toBe(seeded.home);
            expect(item.get('homeGoals')).toBe(seeded.homeGoals);
            expect(item.get('away')).toBe(seeded.away);
            expect(item.get('awayGoals')).toBe(seeded.awayGoals);
            expect(item.get('awayBehinds')).toBe(seeded.awayBehinds);
            expect(item.get('venue')).toBe(seeded.venue);
            expect(item.get('date')).toBe(seeded.date);
            expect(item.get('time')).toBe(seeded.time);
            expect(item.get('attendance')).toBe(seeded.attendance);
        });
    }));
});
