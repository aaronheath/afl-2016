import {BaseException} from './base';

export class ItemException extends BaseException {
    constructor(message : string) {
        super(message);
    }
}
