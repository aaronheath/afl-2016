import {Injectable} from '@angular/core';

declare const moment;

export declare type Timezone = string;

@Injectable()
export class TimeService {
    private guessedTimezone : Timezone;
    private customTimezone : Timezone = '';

    constructor() {
        this.guessedTimezone = moment.tz.guess();
    }

    setTimezone(timezone) {
        this.customTimezone = timezone;
    }

    getTimezone() : Timezone {
        return this.customTimezone || this.guessedTimezone;
    }
}
