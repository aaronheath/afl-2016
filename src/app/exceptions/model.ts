import {BaseException} from './base';

export class ModelException extends BaseException {
    constructor(message : string) {
        super(message);
    }
}
