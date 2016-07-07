import { Map } from 'immutable';

import { ItemException } from '../exceptions/index';

// This can be removed when Symbol is known to TypeScript
declare const Symbol;

/**
 * Interfaces
 */

export interface ItemData {
    [x: string]: any;
}

export interface ItemInterface {
    create(data: ItemData): this;
    fill(data: ItemData): this;
    set(key: string, value: any): this;
    get(keys: string[] | string): any;
    equals(key: string, value: any): boolean;
    uid(): symbol;
    isUid(symbol: symbol): boolean;
    toObject(): any;
}

/**
 * Base Item which can be expanded as required for unique models.
 */
export class Item implements ItemInterface {
    /**
     * Each item has it's own 'symbol' property which is defined upon construction.
     */
    protected symbol : symbol;

    /**
     * Immutable object for the Items data.
     */
    protected data : Map<string, any>;

    /**
     * Constructor.
     *
     * Defines this.symbol.
     */
    constructor() {
        this.symbol = Symbol();
    }

    /**
     * Creates / replaces this.data with immutable object containing data provided.
     *
     * @param data
     * @returns {Item}
     */
    create(data : ItemData) : this {
        if(!Object.keys(data).length) {
            throw new ItemException('Unable to create item from empty object.');
        }

        this.data = Map(data);

        return this;
    }

    /**
     * Merges data provided with data contained in this.data.
     *
     * @param data
     * @returns {Item}
     */
    fill(data : ItemData) : this {
        this.data = this.data.merge(data);

        return this;
    }

    /**
     * Sets the given key / value pair in this.data. Will overwrite any existing value for key.
     *
     * @param key
     * @param value
     * @returns {Item}
     */
    set(key : string, value : any) {
        this.data = this.data.set(key, value);

        return this;
    }

    /**
     * Return single or array of values corresponding to string / array of keys provided.
     *
     * @param keys
     * @returns {*[]}
     */
    get(keys : string[] | string) : any | any[] {
        const values = this.getFromArray(this.convertToArray(keys));

        if(values.length === 0) {
            return;
        }

        return values.length === 1 ? values[0] : values;
    }

    /**
     * Gets all values mapping back to array of keys.
     *
     * @param keys
     * @returns {Array<any>}
     */
    protected getFromArray(keys : string[]) : any[] {
        return this.data.filter((val, key) => keys.includes(key)).toArray();
    }

    /**
     * Determines whether value provided equals known value for key.
     *
     * @param key
     * @param value
     * @returns {boolean}
     */
    equals(key : string, value : any) : boolean {
        return this.data.get(key) === value;
    }

    /**
     * Returns unique symbol for Item.
     *
     * @returns {symbol}
     */
    uid() : symbol {
        return this.symbol;
    }

    /**
     * Returns true if provided symbol equals known symbol for Item.
     *
     * @param symbol
     * @returns {boolean}
     */
    isUid(symbol : symbol) : boolean {
        return this.symbol === symbol;
    }

    /**
     * Returns plain js object of Item's data.
     *
     * @returns {{}}
     */
    toObject() : any {
        return this.data.toObject();
    }

    protected convertToArray<T>(data : T | T[]) : T[] {
        return Array.isArray(data) ? data : [data];
    }
}
