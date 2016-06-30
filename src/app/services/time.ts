import { Injectable } from '@angular/core';

declare const moment;

export declare type Timezone = string;

/**
 * TimeService
 *
 * Repository for time related matters.
 *
 * TODO:
 * - Port momentjs usage over to this service rather than calling directly.
 */
@Injectable()
export class TimeService {
    /**
     * Timezone guessed by moment js.
     */
    private guessedTimezone : Timezone;

    /**
     * Custom timezone requested by the user.
     *
     * @type {string}
     */
    private customTimezone : Timezone = '';

    /**
     * Constructor populates the guessedTimezone class var.
     */
    constructor() {
        this.guessedTimezone = moment.tz.guess();
    }

    /**
     * Set the customTimezone.
     *
     * @param timezone
     */
    setTimezone(timezone) : void {
        this.customTimezone = timezone;
    }

    /**
     * Returns timezone to be used. If custom is defined then that takes precedence over the guessedTimezone.
     *
     * @returns {Timezone}
     */
    getTimezone() : Timezone {
        return this.customTimezone || this.guessedTimezone;
    }
}
