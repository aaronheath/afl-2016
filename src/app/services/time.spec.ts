import { addProviders, inject } from '@angular/core/testing';

import { TimeService } from './time';

declare const moment;

describe('TimeService', () => {
    const providers = [
        TimeService,
    ];

    const customTz = 'Africa/Khartoum';

    beforeEach(() => {
        addProviders(providers);
    });

    it('should be constructed', inject([TimeService], (service: TimeService) => {
        expect(service.getTimezone).toBeDefined();
    }));

    it('setTimezone() should allow setting a timezone', inject([TimeService], (
        service: TimeService
    ) => {
        expect(() => service.setTimezone(customTz)).not.toThrow();
    }));

    it('getTimezone() should return guessed timezone', inject([TimeService], (
        service: TimeService
    ) => {
        const guessedTz = moment.tz.guess();

        expect(service.getTimezone()).toBe(guessedTz);
    }));

    it('getTimezone() should return set timezone', inject([TimeService], (
        service: TimeService
    ) => {
        service.setTimezone(customTz);

        expect(service.getTimezone()).toBe(customTz);
    }));
});
