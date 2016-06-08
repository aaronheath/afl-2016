import {Http, Response, ResponseOptions, ResponseOptionsArgs} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {inject, getTestInjector} from '@angular/core/testing';

export class TestUtils {
    public standardTimeout : number = 1000; // 1 second
    public mockedBackend : MockBackend;

    public generateMockBackend(success : boolean = false, response : ResponseOptionsArgs = {}) : Function {
        return success ? this.successMockBackend(response) : this.errorMockBackend();
    }

    private successMockBackend(response : ResponseOptionsArgs) : Function {
        return inject([MockBackend, Http], (_mockbackend, _http) => {
            const baseResponse = new Response(new ResponseOptions(response));

            _mockbackend.connections.subscribe((c:MockConnection) => c.mockRespond(baseResponse));

            this.mockedBackend = _mockbackend;
        });
    }

    private errorMockBackend() : Function {
        return inject([MockBackend], (_mockbackend) => {
            _mockbackend.connections.subscribe((c:MockConnection) => c.mockError());

            this.mockedBackend = _mockbackend;
        });
    }

    public resetProviders(providers) : void {
        const testInjector = getTestInjector();

        testInjector.reset();

        testInjector.addProviders(providers);
    }
}
