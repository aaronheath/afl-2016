import {Map} from 'immutable';

/**
 * Base extender the core JS Error object.
 * MDN Doc: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 */
export class BaseException extends Error implements Error {
    protected store : Map<string, any>;
    public name : string;
    public message : string;

    /**
     * Constructs the Error. Beyond performing default actions of Error object the message is also stored within
     * the custom 'store' for the error.
     *
     * @param message
     */
    constructor(message : string) {
        super(message);

        this.store = Map({
            message: message,
        });

        this.message = message;
    }

    /**
     * Store additional data relating to the error.
     *
     * @param data
     */
    public addData(data) {
        this.store.set('data', data);
    }

    /**
     * Get additional data relating to the error.
     *
     * @param key
     * @returns {any}
     */
    public get(key) {
        return this.store.get(key);
    }
}
