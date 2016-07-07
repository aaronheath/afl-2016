import { BaseException } from './index';

/**
 * Extends BaseException for use with the base models Item class.
 */
export class ItemException extends BaseException {
    constructor(message : string) {
        super(message);
    }
}
