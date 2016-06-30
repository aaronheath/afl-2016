import {provide} from '@angular/core';
import {Http, BaseRequestOptions} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {Observable} from 'rxjs/Observable';
import {beforeEachProviders, beforeEach, describe, expect, inject, it} from '@angular/core/testing';

import {TestUtils} from '../tests/test-utils';
import {MatchesService} from './matches';
import { Match, MatchItem } from '../models/index';
import {getMatches} from '../tests/example-data-matches';

const testUtils = new TestUtils();

const matches = getMatches();

describe('MatchesService', () => {
    const providers = [
        provide(
            MatchesService,
            {
                useFactory: (backend) => {
                    const matchesService = new MatchesService(backend);

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
        provide(
            Match,
            {
                useFactory: () => {
                    console.log('Match', Match);

                    spyOn(Match, 'updateOrCreate').and.callThrough();

                    return Match;
                },
                deps: [],
            }
        ),
    ];

    beforeEachProviders(() => providers);

    beforeEach(testUtils.generateMockBackend(true, {body: matches}));

    it('should be constructed', inject([MatchesService, Http], (matchesService: MatchesService, http: Http) => {
        matchesService.observable$.subscribe((data) => {
            expect(matchesService.load).toHaveBeenCalled();
            expect(matchesService.observable$).toEqual(jasmine.any(Observable));
        });
    }));

    it('load() should fetch match data, update Match Model and call next on the observer', inject([
        MatchesService,
        Match,
    ], (matchesService: MatchesService) => {
        const promise = new Promise((resolve, reject) => {
            let loadCalls = 0;

            matchesService.observable$.subscribe((data) => {
                loadCalls++;

                if(loadCalls === 1) {
                    matchesService.load();
                }

                if(loadCalls === 2) {
                    expect(matchesService.load).toHaveBeenCalledTimes(loadCalls);

                    expect(testUtils.mockedBackend.connectionsArray.length).toBe(2);
                    expect(testUtils.mockedBackend.connectionsArray[1].request.method).toBe(0); // GET
                    expect(testUtils.mockedBackend.connectionsArray[1].request.url).toBe('/data/matches.json');

                    expect(Match.updateOrCreate).toHaveBeenCalledTimes(loadCalls * 18);

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

        const fn = inject([MatchesService], (matchesService: MatchesService) => {
            const promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    expect(console.error).toHaveBeenCalledWith('Could not load matches.', undefined);

                    resolve();
                }, 500);

                matchesService.observable$.subscribe((data) => {
                    reject('should not have been called');
                });
            });

            return promise;
        });

        return fn();
    }, testUtils.standardTimeout);

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
