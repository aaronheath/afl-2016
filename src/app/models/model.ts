import 'lodash';
import {ModelException} from '../exceptions/model';

export abstract class Model {
    protected models : IItem[] = [];
    protected fillable = [];
    protected item;

    constructor(item) {
        this.item = item;
    }

    public create(data = {}) : IItem {
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

    protected itemCreate(data) {
        const item : IItem = new this.item();

        return item.create(data);
    }

    public find(id) {
        return this.findWhere('id', id);
    }

    public findWhere(key, value) {
        return this.models.find((model) => {
            return model.equals(key, value);
        });
    }

    public findByUid(symbol) {
        return this.models.find((model) => {
            return model.isUid(symbol);
        });
    }

    public all() {
        return this.models;
    }

    public get() {
        //
    }

    public remove() {
        //
    }
}
