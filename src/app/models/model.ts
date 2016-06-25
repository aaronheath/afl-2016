import 'lodash';

import { ModelException } from '../exceptions/index';

/**
 * TODO Features that may one day be implemented
 * - Default values for items
 * - One to one relationships
 * - One to many relationships
 * - Many to many relationships
 */

export class Model<T extends IItem> {
    protected models : T[] = [];
    protected fillable = [];
    protected item;

    constructor(item) {
        this.item = item;
    }

    create(data = {}) : IItem {
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
     * Create or update a record matching the attributes, and fill it with values.
     * @param data
     */
    updateOrCreate(attrs : IModelWhereAttrs[], data = {}) : IItem {
        const matches = this.where(attrs);

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

    find(id) : IItem {
        return this.findWhere('id', id);
    }

    findWhere(key, value) : IItem {
        return this.models.find((model) => {
            return model.equals(key, value);
        });
    }

    findByUid(symbol) {
        return this.models.find((model) => {
            return model.isUid(symbol);
        });
    }

    where(attrs : IModelWhereAttrs[]) : T[] {
        return this.models.filter((item) => {
            const response = attrs.reduce((prev, attr, i) => {
                if(!prev) {
                    return prev;
                }

                if(!attr.operator || attr.operator === '=') {
                    return item.get(attr.key) === attr.value;
                }

                if(attr.operator === '!=') {
                    return item.get(attr.key) !== attr.value;
                }

                // TODO implement support for operators
                return false;
            }, true);

            return response;
        });
    }

    all() : T[] {
        return this.models;
    }

    reset() {
        this.models = [];
    }
}
