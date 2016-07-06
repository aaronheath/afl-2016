import 'lodash';

import { Item, ItemData } from './index';
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
 * - Package up as own NPM module
 * - Caching of queries
 * - Usage of web workers
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

    /**
     * Create a new Item for the Model.
     *
     * @param data
     * @returns {any}
     */
    protected itemCreate(data : ItemData) : T {
        const item : T = new this.item();

        return item.create(data);
    }

    /**
     * Find first Item on the Model with matching 'id'.
     *
     * @param id
     * @returns {Item}
     */
    find(id : any) : Item {
        return this.findWhere('id', id);
    }

    /**
     * Find first Item on the Model with matching key / value pair.
     *
     * @param key
     * @param value
     * @returns {T|boolean|void}
     */
    findWhere(key : string, value : any) : Item {
        return this.models.find((model) => {
            return model.equals(key, value);
        });
    }

    /**
     * Find first Item on the Model with matching Uid (symbol).
     *
     * @param symbol
     * @returns {Item|boolean|void}
     */
    findByUid(symbol : symbol) : Item {
        return this.models.find((model : Item) => {
            return model.isUid(symbol);
        });
    }

    /**
     * Filters Items that satisfies where condition(s). Returns current instance of Model to allow chain of where,
     * or other methods. Results can be call via the this.get() method.
     *
     * Example attrs:
     * [{key: 'key-to-find', value: 'value-to-compare', operator: 'comparison-operation'}, ...]
     *
     * Supported operators:
     * - '=' Equals
     * - '!=' Not Equal
     *
     * TODO:
     * - Support more operations (<, >, <=, >= etc)
     * - Optimiations
     *
     * @param attrs
     * @returns {Model}
     */
    where(attrs : ModelWhereAttrs[]) : this {
        this.transitoryModels = this.transitory().filter((item : T) => {
            const response = attrs.reduce((prev : boolean, attr : ModelWhereAttrs) => {
                if(!prev) {
                    return prev;
                }

                const value = this.isItemMethod(attr.key) ? item[attr.key]() : item.get(attr.key);

                if(!attr.operator || attr.operator === '=') {
                    return value === attr.value;
                }

                if(attr.operator === '!=') {
                    return value !== attr.value;
                }

                return false;
            }, true);

            return response;
        });

        return this;
    }

    /**
     * Sorts transitory Items by 'key'. Returns current instance of Model. Results can be call via the this.get()
     * method.
     *
     * TODO:
     * - Support direction. Currently always descending.
     * - Support sorting by multiple keys with given priority (sort by 'a' asc then by 'b' desc).
     *
     * @param methodOrKey Name of Item method or data 'key'
     * @param direction 'asc' or 'desc'
     * @returns {Model}
     */
    orderBy(methodOrKey : string, direction : 'asc' | 'desc' = 'asc') : this {
        this.transitoryModels = this.transitory().sort((a, b) => {
            const dynamicAttr = this.isItemMethod(methodOrKey);

            if(dynamicAttr) {
                if(a[methodOrKey]() < b[methodOrKey]()) {
                    return -1;
                }

                if(a[methodOrKey]() > b[methodOrKey]()) {
                    return 1;
                }

                return 0;
            }

            if(!dynamicAttr) {
                if(a.get(methodOrKey) < b.get(methodOrKey)) {
                    return -1;
                }

                if(a.get(methodOrKey) > b.get(methodOrKey)) {
                    return 1;
                }

                return 0;
            }

            return 0;
        });

        return this;
    }

    /**
     * Sum of transitory Items by key or method output.
     *
     * @param key
     * @returns {any}
     */
    sum(key : string) : number {
        let response;

        if(this.isItemMethod(key)) {
            response = this.transitory().reduce((prev, curr) => prev + curr[key](), 0);
        } else {
            response = this.transitory().reduce((prev, curr) => prev + curr.get(key), 0);
        }

        this.resetTransitory();

        return response;
    }

    /**
     * Count of transitory Items.
     *
     * @returns {number}
     */
    count() : number {
        const response = this.transitoryModels.length;

        this.resetTransitory();

        return response;
    }

    /**
     * Returns array of transitory Items.
     *
     * @returns {T[]}
     */
    get() : T[] {
        const response = this.transitoryModels;

        this.resetTransitory();

        return response;
    }

    /**
     * Returns first Item on array of transitory Items
     *
     * @returns {T}
     */
    first() : T {
        const response = this.transitoryModels.length ? this.transitoryModels[0] : undefined;

        this.resetTransitory();

        return response;
    }

    /**
     * Return array of all Items.
     *
     * @returns {T[]}
     */
    all() : T[] {
        this.resetTransitory();

        return this.models;
    }

    /**
     * Performs hard reset of stored Items.
     */
    reset() : void {
        this.models = [];
    }

    /**
     * Returns array of transitory Items. Should this.transitoryUse be true then the existing transitory Items array
     * will be returned, otherwise the this.models Items array will be returned.
     *
     * Typicall called by methods such as where(), orderBy() and get().
     *
     * @returns {T[]}
     */
    protected transitory() : T[] {
        const response = this.transitoryUse ? this.transitoryModels : this.models;

        this.startTransitory();

        return response;
    }

    /**
     * To be called when using the transitory Items array.
     */
    protected startTransitory() {
        this.transitoryUse = true;
    }

    /**
     * Resets transitory Items array. Should be called when invoking a new lookup.
     */
    protected resetTransitory() {
        this.transitoryUse = false;

        this.transitoryModels = [];
    }

    /**
     * Determines whether given key is a method on the Item.
     *
     * @param key
     * @returns {boolean|boolean}
     */
    protected isItemMethod(key : string) : boolean {
        const item : T = new this.item();

        return _.isFunction(item[key]);
    }
}
