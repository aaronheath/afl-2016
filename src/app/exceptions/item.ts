import {Exception} from './base';

export class ItemException extends Exception {
    constructor(message : string, data : any[] = []) {
        super(message, data);
    }
}
