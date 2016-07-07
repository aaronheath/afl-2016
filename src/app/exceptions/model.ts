import { BaseException } from './index';

/**
 * Extends BaseException for use with the base Model class.
 */
export class ModelException extends BaseException {
    constructor(message : string) {
        super(message);
    }
}
