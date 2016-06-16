import {Injectable} from '@angular/core';
import {Map} from 'immutable';
import {ItemException} from '../exceptions/item';

declare const Symbol;

// TODO Convert this class over to not require Angular

@Injectable()
export class Item implements IItem {
    protected symbol : symbol;
    protected data : Map<string, any>;

    constructor() {
        this.symbol = Symbol();
    }

    public create(data : IItemData) : this {
        if(!Object.keys(data).length) {
            throw new ItemException('Unable to create item from empty object.');
        }

        this.data = Map(data);

        return this;
    }

    public get(keys : string[] | string) : any | any[] {
        const values = this.getFromArray(this.toArray(keys));

        return values.length === 1 ? values[0] : values;
    }

    protected getFromArray(keys : string[]) : any[] {
        return this.data.filter((val, key) => keys.includes(key)).toArray();
    }

    public equals(key : string, value : any) : boolean {
        return this.data.get(key) === value;
    }

    public uid() : symbol {
        return this.symbol;
    }

    public isUid(symbol : symbol) : boolean {
        return this.symbol === symbol;
    }

    protected toArray<T>(data : T | T[]) : T[] {
        return Array.isArray(data) ? data : [data];
    }
}
