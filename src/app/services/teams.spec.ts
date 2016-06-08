import {provide} from '@angular/core';
import {Http, BaseRequestOptions} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {Observable} from 'rxjs/Observable';
import {beforeEachProviders, beforeEach, describe, expect, inject, it} from '@angular/core/testing';

import {TestUtils} from '../tests/test-utils';
import {TeamsService} from './teams';
import {getTeams} from '../tests/example-data-teams';

const testUtils = new TestUtils();

describe('TeamsService', () => {
    const providers = [
        provide(
            TeamsService,
            {
                useFactory: (backend) => {
                    const service = new TeamsService(backend);

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

    beforeEachProviders(() => providers);

    beforeEach(testUtils.generateMockBackend(true, {body: getTeams()}));

    it('should be constructed', inject([TeamsService, Http], (service: TeamsService, http: Http) => {
        service.observable$.subscribe((data) => {
            expect(service.load).toHaveBeenCalled();
            expect(service.observable$).toEqual(jasmine.any(Observable));
        });
    }));

    it('load() should fetch team data and call next on the observer', inject([
        TeamsService,
    ], (service: TeamsService) => {
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
                    expect(testUtils.mockedBackend.connectionsArray[1].request.url).toBe('/data/teams.json');

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

        const fn = inject([TeamsService], (service: TeamsService) => {
            const promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    expect(console.error).toHaveBeenCalledWith('Could not load teams.', undefined);

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

    it('getTeams() should return all teams', inject([TeamsService], (
        service: TeamsService
    ) => {
        service.observable$.subscribe((data) => {
            const allTeams = service.getTeams();
            let team;

            // Adelaide
            team = allTeams['ADL'];
            expect(team).toBeDefined();
            expect(team.fullName).toBe('Adelaide');
            expect(team.abbreviation).toBe('ADL');
            expect(team.city).toBe('Adelaide');
            expect(team.state).toBe('SA');

            // Essendon
            team = allTeams['ESS'];
            expect(team).toBeDefined();
            expect(team.fullName).toBe('Essendon');
            expect(team.abbreviation).toBe('ESS');
            expect(team.city).toBe('Melbourne');
            expect(team.state).toBe('VIC');

            // Port Adelaide
            team = allTeams['PA'];
            expect(team).toBeDefined();
            expect(team.fullName).toBe('Port Adelaide');
            expect(team.abbreviation).toBe('PA');
            expect(team.city).toBe('Adelaide');
            expect(team.state).toBe('SA');
        });
    }));
});
