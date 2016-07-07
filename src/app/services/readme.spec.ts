import { provide } from '@angular/core';
import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';
import { addProviders, fakeAsync, inject, tick } from '@angular/core/testing';

import { TestUtils } from '../tests/test-utils';
import { ReadmeService } from './index';

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
                    spyOn(ReadmeService.prototype, 'load').and.callThrough();

                    return new ReadmeService(backend);
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

    beforeEach(() => {
        addProviders(providers);

        testUtils.generateMockBackend(true, {body: mockedReadme})();

        spyOn(console, 'error');
    });

    it('should be constructed', inject([ReadmeService, Http], (service: ReadmeService, http: Http) => {
        service.observable$.subscribe((data) => {
            expect(ReadmeService.prototype.load).toHaveBeenCalled();
            expect(service.observable$).toEqual(jasmine.any(Observable));
        });
    }));

    it('load() should fetch venue data and call next on the observer', inject([ReadmeService], (
        service: ReadmeService
    ) => {
        service.observable$.subscribe((data) => {
            expect(service.load).toHaveBeenCalledTimes(1);
            expect(testUtils.mockedBackend.connectionsArray.length).toBe(1);
            expect(testUtils.mockedBackend.connectionsArray[0].request.method).toBe(0); // GET
            expect(testUtils.mockedBackend.connectionsArray[0].request.url).toBe('/data/README.md');
        });
    }));

    it('load() http call should handle an error response', fakeAsync(() => {
        testUtils.resetProviders(providers);

        testUtils.generateMockBackend()();

        inject([ReadmeService], (service: ReadmeService) => {
            tick(500);
            expect(console.error).toHaveBeenCalledWith('Could not load readme.', undefined);
        })();
    }));

    it('getReadme() should return the readme', inject([ReadmeService], (
        service: ReadmeService
    ) => {
        service.observable$.subscribe(() => {
            const readme = service.getReadme();

            expect(readme).toBe(mockedReadme);
        });
    }));
});
