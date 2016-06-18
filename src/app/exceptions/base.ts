import {Map} from 'immutable';

export class BaseException extends Error implements Error {
    protected store : Map<string, any>;
    public name : string;
    public message : string;

    constructor(message : string) {
        super(message);

        this.store = Map({
            message: message,
        });

        this.message = message;
    }

    public addData(data) {
        this.store.set('data', data);
    }

    public get(key) {
        return this.store.get(key);
    }
}
