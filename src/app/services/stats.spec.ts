import { provide } from '@angular/core';
import { BaseRequestOptions, Http, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';
import { addProviders, fakeAsync, inject, tick } from '@angular/core/testing';

import { TestUtils } from '../tests/test-utils';
import { MatchesService, StatsService, TeamsService, VenuesService } from './index';
import { Match, MatchItem } from '../models/index';

import {getTeams} from '../tests/example-data-teams';
import {getMatches} from '../tests/example-data-matches';
import {getVenues} from '../tests/example-data-venues';

declare const moment;

const testUtils = new TestUtils();

describe('StatsService', () => {
    const providers = [
        provide(
            StatsService,
            {
                useFactory: (matches, teams, venues) => {
                    const service = new StatsService(matches, teams, venues);

                    spyOn(service, 'loadMatches').and.callThrough();
                    spyOn(service, 'loadTeams').and.callThrough();
                    spyOn(service, 'loadVenues').and.callThrough();

                    return service;
                },
                deps: [MatchesService, TeamsService, VenuesService],
            }
        ),
        provide(
            MatchesService,
            {
                useFactory: (backend) => new MatchesService(backend),
                deps: [Http, Match],
            }
        ),
        provide(
            TeamsService,
            {
                useFactory: (backend) => new TeamsService(backend),
                deps: [Http],
            }
        ),
        provide(
            VenuesService,
            {
                useFactory: (backend) => new VenuesService(backend),
                deps: [Http],
            }
        ),
        provide(
            Http,
            {
                useFactory: (backend, options) => {
                    return new Http(backend, options);
                },
                deps: [MockBackend, BaseRequestOptions],
            }
        ),
        MockBackend,
        BaseRequestOptions,
        provide(
            Match,
            {
                useFactory: () => {
                    //console.log('new MatchModel<MatchItem>(MatchItem)');
                    //new MatchModel<MatchItem>(MatchItem)

                    Match.reset();
                    return Match;
                },
                deps: [],
            }
        ),
    ];

    beforeEach(() => {
        addProviders(providers);

        inject([MockBackend, Http], (_mockbackend, _http) => {
            _mockbackend.connections.subscribe((c:MockConnection) => {
                const baseResponse = new Response(new ResponseOptions({body: createBaseResponse(c.request.url)}));

                return c.mockRespond(baseResponse);
            });

            this.mockedBackend = _mockbackend;
        })();

        Match.reset();
    });

    function createBaseResponse(path) {
        const endpoints = [
            {
                path: '/data/matches.json',
                body: getMatches(),
            },
            {
                path: '/data/teams.json',
                body: getTeams(),
            },
            {
                path: '/data/venues.json',
                body: getVenues(),
            },
        ];

        const match = endpoints.find((item) => {
            return item.path === path;
        });

        if(!match) {
            return {};
        }

        return match ? match.body : '';
    }

    it('should be constructed', inject([StatsService], (service: StatsService) => {
        service.observable$.subscribe(() => {
            expect(service.observable$).toEqual(jasmine.any(Observable));
        });
    }));

    it('on construction observable should not be called if one (or more) `loads` doesn\'t fails', fakeAsync(() => {
        testUtils.resetProviders(providers);

        testUtils.generateMockBackend()();

        spyOn(console, 'error');

        inject([StatsService], (service: StatsService) => {
            service.observable$.subscribe(() => {
                expect(false).toBe(true); // This should never be called
            });

            tick(500);

            expect(console.error).toHaveBeenCalled();
        })();
    }));

    it('getMatchesByRound() should return all matches for round', inject([StatsService, MatchesService], (
        service: StatsService
    ) => {
        service.observable$.subscribe(() => {
            const rnd1 = service.getMatchesByRound(1);

            expect(Array.isArray(rnd1)).toBe(true);
            expect(rnd1.length).toBe(9);

            // Test all matches in round have the expected attrs defined
            rnd1.forEach((match) => expect(match).toEqual(jasmine.any(MatchItem)));

            // Test individual match (round 2, match 2) has matching attrs
            const rnd2 = service.getMatchesByRound(2);
            const r2m2 = rnd2[1];

            expect(r2m2.home().get('fullName')).toBe('Adelaide');
            expect(r2m2.home().get('abbreviation')).toBe('ADL');
            expect(r2m2.away().get('fullName')).toBe('Port Adelaide');
            expect(r2m2.away().get('abbreviation')).toBe('PA');
            expect(r2m2.venue().get('fullName')).toBe('Adelaide Oval');
            expect(r2m2.venue().get('id')).toBe('AO');
        });
    }));

    it('getRoundNumbers() should return array of known round numbers', inject([StatsService], (
        service: StatsService
    ) => {
        service.observable$.subscribe((data) => {
            const rounds = service.getRoundNumbers();

            expect(Array.isArray(rounds)).toBe(true);
            expect(rounds.length).toBe(2);
        });
    }));

    it('getLadder() should return ladder array', inject([StatsService], (
        service: StatsService
    ) => {
        service.observable$.subscribe((data) => {
            const ladder = service.getLadder();

            expect(Array.isArray(ladder)).toBe(true);
            expect(ladder.length).toBe(18);

            // Expect 1st to be Western Bulldogs
            const first = ladder[0];
            expect(first.team().get('fullName')).toBe('Western Bulldogs');
            expect(first.played()).toBe(1);
            expect(first.percentage()).toBe(271.05);
            expect(first.points()).toBe(4);

            // Expect 9th to be Richmond
            const eighth = ladder[7];
            expect(eighth.team().get('fullName')).toBe('Richmond');
            expect(eighth.played()).toBe(2);
            expect(eighth.percentage()).toBe(104.71);
            expect(eighth.points()).toBe(4);

            // Expect 9th to be Melbourne
            const ninth = ladder[8];
            expect(ninth.team().get('fullName')).toBe('Melbourne');
            expect(ninth.played()).toBe(1);
            expect(ninth.percentage()).toBe(102.56);
            expect(ninth.points()).toBe(4);
        });
    }));
});
