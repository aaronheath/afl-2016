import {provide} from '@angular/core';
import {Http, BaseRequestOptions, Response, ResponseOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {Observable} from 'rxjs/Observable';
import {beforeEachProviders, beforeEach, describe, expect, inject, it, fakeAsync, tick} from '@angular/core/testing';

import {TestUtils} from '../tests/test-utils';
import {StatsService} from './stats';
import {MatchesService} from './matches';
import {TeamsService} from './teams';
import {VenuesService} from './venues';
import {TimeService} from './time';

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
                useFactory: (matches, teams, venues, time) => {
                    const service = new StatsService(matches, teams, venues, time);

                    spyOn(service, 'loadMatches').and.callThrough();
                    spyOn(service, 'loadTeams').and.callThrough();
                    spyOn(service, 'loadVenues').and.callThrough();

                    return service;
                },
                deps: [MatchesService, TeamsService, VenuesService, TimeService],
            }
        ),
        provide(
            MatchesService,
            {
                useFactory: (backend) => new MatchesService(backend),
                deps: [Http],
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
        TimeService,
        MockBackend,
        BaseRequestOptions,
    ];

    beforeEachProviders(() => providers);

    beforeEach(inject([MockBackend, Http], (_mockbackend, _http) => {
        _mockbackend.connections.subscribe((c:MockConnection) => {
            const baseResponse = new Response(new ResponseOptions({body: createBaseResponse(c.request.url)}));

            return c.mockRespond(baseResponse);
        });

        this.mockedBackend = _mockbackend;
    }));

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
        service.observable$.subscribe((data) => {
            expect(service.observable$).toEqual(jasmine.any(Observable));
        });
    }));

    it('on construction observable should not be called if one (or more) `loads` doesn\'t fails', fakeAsync(() => {
        testUtils.resetProviders(providers);

        testUtils.generateMockBackend()();

        spyOn(console, 'error');

        return inject([StatsService], (service: StatsService) => {
            service.observable$.subscribe(() => {
                expect(false).toBe(true); // This should never be called
            });

            tick(500);

            expect(console.error).toHaveBeenCalled();
        })();
    }));

    it('getMatchesByRound() should return all matches for round', inject([StatsService], (
        service: StatsService
    ) => {
        service.observable$.subscribe((data) => {
            const rnd1 = service.getMatchesByRound(1);

            expect(Array.isArray(rnd1)).toBe(true);
            expect(rnd1.length).toBe(9);

            // Test all matches in round have the expected attrs defined
            rnd1.forEach((match) => {
                hasAttrs(match, [
                    'h_home',
                    'h_home_abbr',
                    'h_away',
                    'h_away_abbr',
                    'h_venue',
                    'h_venue_abbr',
                    'venue_moment',
                    'local_moment',
                    'local_datetime',
                    'h_date',
                    'h_venue_time',
                    'h_local_time',
                ]);
            });

            // Test individual match (round 2, match 2) has matching attrs
            const rnd2 = service.getMatchesByRound(2);
            const r2m2 = rnd2[1];

            expect(r2m2.home().get('fullName')).toBe('Adelaide');
            expect(r2m2.home().get('abbreviation')).toBe('ADL');
            expect(r2m2.away().get('fullName')).toBe('Port Adelaide');
            expect(r2m2.away().get('abbreviation')).toBe('PA');
            expect(r2m2.venue().get('fullName')).toBe('Adelaide Oval');
            expect(r2m2.venue().get('id')).toBe('AO');
            //expect(r2m2.venue.get('fullName')).toEqual(jasmine.any(moment));
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

    //it('getSummaryForRound() should return round summary object', inject([StatsService], (
    //    service: StatsService
    //) => {
    //    service.observable$.subscribe((data) => {
    //        const summary = service.getSummaryForRound(1);
    //
    //        expect(summary.matchPlayed).toBe(true);
    //        expect(summary.goals).toBe(255);
    //        expect(summary.behinds).toBe(218);
    //        expect(summary.totalPoints).toBe(1748);
    //        expect(summary.accuracy).toBe(53.911205073995774);
    //        expect(summary.attendance).toBe(360850);
    //    });
    //}));
});

function hasAttrs(obj, attrs) {
    attrs.forEach((attr) => {
        expect(obj[attr]).toBeDefined();
    });
}
