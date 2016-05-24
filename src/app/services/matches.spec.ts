import {
    beforeEachProviders,
    beforeEach,
    describe,
    expect,
    inject,
    it,
} from '@angular/core/testing';

import {provide} from '@angular/core';

import {Http, Response, BaseRequestOptions, ResponseOptions} from '@angular/http';

import {MockBackend, MockConnection} from '@angular/http/testing';

import {MatchesService} from './matches';

import {getMatches, getMatchesWithPointsAndTimes} from '../tests/example-data-matches';

describe('MatchesService', () => {
    const matchesExpected = getMatchesWithPointsAndTimes();

    beforeEachProviders(() => [
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
                    return new Http(backend, options);
                },
                deps: [MockBackend, BaseRequestOptions],
            }
        ),
    ]);

    beforeEach(inject([MockBackend], (_mockbackend) => {
        const baseResponse = new Response(new ResponseOptions({body: getMatches()}));

        _mockbackend.connections.subscribe((c:MockConnection) => c.mockRespond(baseResponse));
    }));

    it('should parse and add calculated attr to matches', inject([MatchesService], (matchesService: MatchesService) => {
        matchesService.observable$.subscribe((data) => {
            expect(matchesService.load).toHaveBeenCalled();

            const allMatches = matchesService.getAllMatches();

            // Round 1 Match 1
            const receivedRound1Match1 = allMatches[1][0];
            const expectedRound1Match1 = matchesExpected[1][0];
            compareMatches(receivedRound1Match1, expectedRound1Match1);

            // Round 2 Match 2
            const receivedRound2Match2 = allMatches[2][1];
            const expectedRound2Match2 = matchesExpected[2][1];
            compareMatches(receivedRound2Match2, expectedRound2Match2);

            // Round 2 Match 3 (Match not played yet)
            const receivedRound2Match3 = allMatches[2][2];
            const expectedRound2Match3 = matchesExpected[2][2];
            compareMatches(receivedRound2Match3, expectedRound2Match3);
        });
    }));
});

function compareMatches(received, expected) {
    expect(received.attendance).toBe(expected.attendance);
    expect(received.away).toBe(expected.away);
    expect(received.awayGoals).toBe(expected.awayGoals);
    expect(received.awayBehinds).toBe(expected.awayBehinds);
    expect(received.awayPoints).toBe(expected.awayPoints);
    expect(received.date).toBe(expected.date);
    expect(received.h_date).toBe(expected.h_date);
    expect(received.h_local_time).toBe(expected.h_local_time);
    expect(received.h_venue_time).toBe(expected.h_venue_time);
    expect(received.home).toBe(expected.home);
    expect(received.homeGoals).toBe(expected.homeGoals);
    expect(received.homeBehinds).toBe(expected.homeBehinds);
    expect(received.homePoints).toBe(expected.homePoints);
    expect(received.margin).toBe(expected.margin);
    expect(received.result).toBe(expected.result);
    expect(received.time).toBe(expected.time);
    expect(received.venue).toBe(expected.venue);
}
