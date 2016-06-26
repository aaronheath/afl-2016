import { Map } from 'immutable';

import { ItemException } from '../exceptions/index';

declare const Symbol;

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

export class Item implements ItemInterface {
    protected symbol : symbol;
    protected data : Map<string, any>;

    constructor() {
        this.symbol = Symbol();
    }

    create(data : ItemData) : this {
        if(!Object.keys(data).length) {
            throw new ItemException('Unable to create item from empty object.');
        }

        this.data = Map(data);

        return this;
    }

    fill(data : ItemData) : this {
        this.data = this.data.merge(data);

        return this;
    }

    set(key, value) {
        this.data = this.data.set(key, value);

        return this;
    }

    get(keys : string[] | string) : any | any[] {
        const values = this.getFromArray(this.convertToArray(keys));

        if(values.length === 0) {
            return;
        }

        return values.length === 1 ? values[0] : values;
    }

    protected getFromArray(keys : string[]) : any[] {
        return this.data.filter((val, key) => keys.includes(key)).toArray();
    }

    equals(key : string, value : any) : boolean {
        return this.data.get(key) === value;
    }

    uid() : symbol {
        return this.symbol;
    }

    isUid(symbol : symbol) : boolean {
        return this.symbol === symbol;
    }

    toObject() {
        return this.data.toObject();
    }

    protected convertToArray<T>(data : T | T[]) : T[] {
        return Array.isArray(data) ? data : [data];
    }
}
