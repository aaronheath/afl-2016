import {Map} from 'immutable';

export class Exception {
    protected store : Map<string, any>;

    constructor(message : string, data : any[] = []) {
        this.store = Map({
            message: message,
            data: data,
        });
    }

    public get(key) {
        return this.store.get(key);
    }
}
