import {Injectable} from '@angular/core';

declare const moment;

@Injectable()
export class TimeService {
    _guessedTimezone : ITimezone;
    _customTimezone : ITimezone;

    constructor() {
        this._guessedTimezone = moment.tz.guess();

        this._customTimezone = '';
    }

    getTimezone() : ITimezone {
        return this._customTimezone || this._guessedTimezone;
    }
}
