import { provide } from '@angular/core';
import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';
import { addProviders, fakeAsync, inject, tick } from '@angular/core/testing';

import { TestUtils } from '../tests/test-utils';
import { TeamsService } from './index';
import { Team, TeamItem } from '../models/index';
import { getTeams } from '../tests/example-data-teams';

const testUtils = new TestUtils();

const seededTeams = getTeams();

describe('TeamsService', () => {
    const providers = [
        provide(
            TeamsService,
            {
                useFactory: (backend) => {
                    spyOn(TeamsService.prototype, 'load').and.callThrough();

                    return new TeamsService(backend);
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
            Team,
            {
                useFactory: () => Team,
                deps: [],
            }
        ),
    ];

    beforeEach(() => {
        addProviders(providers);

        testUtils.generateMockBackend(true, {body: seededTeams})();

        spyOn(console, 'error');
    });

    it('should be constructed', inject([TeamsService, Http], (service: TeamsService, http: Http) => {
        expect(TeamsService.prototype.load).toHaveBeenCalled();
        expect(service.observable$).toEqual(jasmine.any(Observable));
    }));

    it('load() should fetch team data, update Team Model and call next on the observer', () => {
        spyOn(Team, 'updateOrCreate').and.callThrough();

        inject([
            TeamsService,
            Team,
        ], (service: TeamsService) => {
            service.observable$.subscribe((data) => {
                expect(service.load).toHaveBeenCalledTimes(1);

                expect(testUtils.mockedBackend.connectionsArray.length).toBe(1);
                expect(testUtils.mockedBackend.connectionsArray[0].request.method).toBe(0); // GET
                expect(testUtils.mockedBackend.connectionsArray[0].request.url).toBe('/data/teams.json');

                expect(Team.updateOrCreate).toHaveBeenCalledTimes(18);
            });
        })();
    });

    it('load() http call should handle an error response', fakeAsync(() => {
        testUtils.resetProviders(providers);

        testUtils.generateMockBackend()();

        inject([TeamsService], (service: TeamsService) => {
            tick(500);
            expect(console.error).toHaveBeenCalledWith('Could not load teams.', undefined);
        })();
    }));

    it('getTeams() should array of all teams as TeamItem\'s', inject([TeamsService], (
        service: TeamsService
    ) => {
        service.observable$.subscribe(() => {
            const teams = service.getTeams();

            teams.forEach((item) => {
                expect(item).toEqual(jasmine.any(TeamItem));
            });

            // Match the second game
            const item = teams[4];
            const seeded = seededTeams.ESS;

            expect(item.get('fullName')).toBe(seeded.fullName);
            expect(item.get('abbreviation')).toBe(seeded.abbreviation);
            expect(item.get('city')).toBe(seeded.city);
            expect(item.get('state')).toBe(seeded.state);
        });
    }));
});
