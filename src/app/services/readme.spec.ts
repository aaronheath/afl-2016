import {provide} from '@angular/core';
import {Http, BaseRequestOptions} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {Observable} from 'rxjs/Observable';
import {beforeEachProviders, beforeEach, describe, expect, inject, it} from '@angular/core/testing';

import {TestUtils} from '../tests/test-utils';
import {ReadmeService} from './readme';

const testUtils = new TestUtils();

const mockedReadme = `
# Title

Some text around here.

## Another Title

Some more text around here.
`;

describe('ReadmeService', () => {
    const providers = [
        provide(
            ReadmeService,
            {
                useFactory: (backend) => {
                    const service = new ReadmeService(backend);

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

    beforeEach(testUtils.generateMockBackend(true, {body: mockedReadme}));

    it('should be constructed', inject([ReadmeService, Http], (service: ReadmeService, http: Http) => {
        service.observable$.subscribe((data) => {
            expect(service.load).toHaveBeenCalled();
            expect(service.observable$).toEqual(jasmine.any(Observable));
        });
    }));

    it('load() should fetch venue data and call next on the observer', inject([
        ReadmeService,
    ], (service: ReadmeService) => {
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
                    expect(testUtils.mockedBackend.connectionsArray[1].request.url).toBe('/data/README.md');

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

        const fn = inject([ReadmeService], (service: ReadmeService) => {
            const promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    expect(console.error).toHaveBeenCalledWith('Could not load readme.', undefined);

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

    it('getReadme() should return the readme', inject([ReadmeService], (
        service: ReadmeService
    ) => {
        service.observable$.subscribe((data) => {
            const readme = service.getReadme();

            expect(readme).toBe(mockedReadme);
        });
    }));
});
