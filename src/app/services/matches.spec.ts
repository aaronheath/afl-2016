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

import {Observable} from 'rxjs/Observable';

import {getMatches, getMatchesWithPointsAndTimes} from '../tests/example-data-matches';

describe('MatchesService', () => {
    const standardTimeout = 1000; // 1 second
    const matchesExpected = getMatchesWithPointsAndTimes();

    let mockedBackend;

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
                    const _http = new Http(backend, options);

                    spyOn(_http, 'get').and.callThrough();

                    return _http;
                },
                deps: [MockBackend, BaseRequestOptions],
            }
        ),
    ]);

    beforeEach(inject([MockBackend, Http], (_mockbackend, _http) => {
        const baseResponse = new Response(new ResponseOptions({body: getMatches()}));

        _mockbackend.connections.subscribe((c:MockConnection) => c.mockRespond(baseResponse));

        mockedBackend = _mockbackend;
    }));

    it('should be constructed', inject([MatchesService, Http], (matchesService: MatchesService, http: Http) => {
        matchesService.observable$.subscribe((data) => {
            expect(matchesService.load).toHaveBeenCalled();
            expect(matchesService.observable$).toEqual(jasmine.any(Observable));
        });
    }));

    it('load() should fetch match data, add match attrs and call next on the observer', inject([
        MatchesService
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

                    expect(mockedBackend.connectionsArray.length).toBe(2);
                    expect(mockedBackend.connectionsArray[1].request.method).toBe(0); // GET
                    expect(mockedBackend.connectionsArray[1].request.url).toBe('/data/matches.json');

                    resolve();
                }

                //const allMatches = matchesService.getAllMatches();
                //
                //// Round 1 Match 1
                //const receivedRound1Match1 = allMatches[1][0];
                //const expectedRound1Match1 = matchesExpected[1][0];
                //compareMatches(receivedRound1Match1, expectedRound1Match1);
                //
                //// Round 2 Match 2
                //const receivedRound2Match2 = allMatches[2][1];
                //const expectedRound2Match2 = matchesExpected[2][1];
                //compareMatches(receivedRound2Match2, expectedRound2Match2);
                //
                //// Round 2 Match 3 (Match not played yet)
                //const receivedRound2Match3 = allMatches[2][2];
                //const expectedRound2Match3 = matchesExpected[2][2];
                //compareMatches(receivedRound2Match3, expectedRound2Match3);
            });
        });

        return promise;
    }),
    standardTimeout);
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
