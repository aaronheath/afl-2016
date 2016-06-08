import {Injectable} from '@angular/core';

declare const moment;

@Injectable()
export class TimeService {
    private guessedTimezone : ITimezone;
    private customTimezone : ITimezone = '';

    constructor() {
        this.guessedTimezone = moment.tz.guess();
    }

    setTimezone(timezone) {
        this.customTimezone = timezone;
    }

    getTimezone() : ITimezone {
        return this.customTimezone || this.guessedTimezone;
    }
}
