import 'lodash';

import { Item } from './index';
import { ModelException } from '../exceptions/index';

/**
 * Interface(s)
 */

export interface ModelWhereAttrs {
    key: string;
    value: any;
    operator?: string;
}

/**
 * Base Model which can be expanded as required for unique models.
 *
 * Influenced by Laravel's Eloquent ORM (https://laravel.com/docs/5.2/eloquent).
 *
 * TODO Some of the features that may or may not be implemented one day:
 * - Default values for items
 * - One to one relationships
 * - One to many relationships
 * - Many to many relationships
 */
export class Model<T extends Item> {
    /**
     * Array of Items
     *
     * @type {Array}
     */
    protected models : T[] = [];

    /**
     * Used when chaining methods to enable further limiting / sorting of results.
     *
     * True: An existing response limiting call has been made.
     * False: No existing response limiting call has been made.
     *
     * Example:
     * Item.where([{key: 'test', value: 'testing'}]).orderBy('id', 'desc').get();
     *
     * @type {boolean}
     */
    protected transitoryUse : boolean = false;

    /**
     * Limited and / or sorted array of Items. Used when this.transitoryUse is true as the data for further operations
     * to be performed against.
     *
     * @type {Array}
     */
    protected transitoryModels : T[] = [];

    /**
     * Fields permissible to be set with Item's create method.
     *
     * @type {string[]}
     */
    protected fillable : string[] = [];

    /**
     * Non initialised Item for Model.
     */
    protected item;

    /**
     * Constructor.
     *
     * Expects Item to be provided which will be initialised when Items are being created.
     *
     * @param item
     */
    constructor(item) {
        this.item = item;
    }

    create(data = {}) : T {
        if(!Object.keys(data).length) {
            throw new ModelException('Item contains no attributes.');
        }

        const attrs = {};

        _.forEach(data, (value, key) => {
            if(!this.fillable.includes(key)) {
                return false;
            }

            attrs[key] = value;
        });

        if(!Object.keys(attrs).length) {
            throw new ModelException('Item attributes are not permitted during mass assignment.');
        }

        const item = this.itemCreate(attrs);

        this.models.push(item);

        return item;
    }

    /**
     * Will attempt to locate item using the given key / value pairs. If the item can not be found, an item will be
     * created with the given attributes. If item is found, data is NOT updated.
     */
    firstOrCreate(attrs : ModelWhereAttrs[], data = {}) : T {
        const matches = this.where(attrs).get();

        if(matches.length === 0) {
            return this.create(data);
        } else {
            return matches[0];
        }
    }

    /**
     * Will attempt to locate item using the given key / value pairs. If the item can not be found, an item will be
     * created with the given attributes. If item is found, data WILL BE updated.
     * @param data
     */
    updateOrCreate(attrs : ModelWhereAttrs[], data = {}) : T {
        const matches = this.where(attrs).get();

        if(matches.length === 0) {
            return this.create(data);
        } else {
            return matches[0].fill(data);
        }
    }

    protected itemCreate(data) : T {
        const item : T = new this.item();

        return item.create(data);
    }

    find(id) : Item {
        return this.findWhere('id', id);
    }

    findWhere(key, value) : Item {
        return this.models.find((model) => {
            return model.equals(key, value);
        });
    }

    findByUid(symbol) {
        return this.models.find((model) => {
            return model.isUid(symbol);
        });
    }

    where(attrs : ModelWhereAttrs[]) : this {
        this.transitoryModels = this.transitory().filter((item) => {
            const response = attrs.reduce((prev, attr, i) => {
                if(!prev) {
                    return prev;
                }

                const value = _.isFunction(item[attr.key]) ? item[attr.key]() : item.get(attr.key);

                if(!attr.operator || attr.operator === '=') {
                    return value === attr.value;
                }

                if(attr.operator === '!=') {
                    return value !== attr.value;
                }

                // TODO implement support for operators
                return false;
            }, true);

            return response;
        });

        return this;
    }

    orderBy(key : string, direction : 'asc' | 'desc' = 'asc', dynamicAttr : boolean = false) : this {
        this.transitoryModels = this.transitory().sort((a, b) => {
            if(dynamicAttr) {
                if(a[key]() < b[key]()) {
                    return -1;
                }

                if(a[key]() > b[key]()) {
                    return 1;
                }

                return 0;
            }

            if(!dynamicAttr) {
                if(a.get(key) < b.get(key)) {
                    return -1;
                }

                if(a.get(key) > b.get(key)) {
                    return 1;
                }

                return 0;
            }
        });

        return this;
    }

    sum(key : string, dynamicAttr : boolean = false) : number {
        let response;

        if(dynamicAttr) {
            response = this.transitory().reduce((prev, curr) => prev + curr[key](), 0);
        } else {
            response = this.transitory().reduce((prev, curr) => prev + curr.get(key), 0);
        }

        this.resetTransitory();

        return response;
    }

    count() : number {
        const response = this.transitoryModels.length;

        this.resetTransitory();

        return response;
    }

    get() : T[] {
        const response = this.transitoryModels;

        this.resetTransitory();

        return response;
    }

    first() : T {
        const response = this.transitoryModels.length ? this.transitoryModels[0] : undefined;

        this.resetTransitory();

        return response;
    }

    all() : T[] {
        this.resetTransitory();

        return this.models;
    }

    reset() {
        this.models = [];
    }

    protected transitory() : T[] {
        const response = this.transitoryUse ? this.transitoryModels : this.models;

        this.startTransitiory();

        return response;
    }

    protected startTransitiory() {
        this.transitoryUse = true;
    }

    protected resetTransitory() {
        this.transitoryUse = false;

        this.transitoryModels = [];
    }
}
