import { Item, Model } from './index';
import {ModelException} from '../exceptions/model';

declare const Symbol;

class AbstractedModel<T extends Item> extends Model<T> {
    protected fillable = [
        'id',
        'key3',
    ];
}

describe('Model', () => {
    let model, testData, fillableData;

    beforeEach(() => {
        //console.log('set model');
        model = new AbstractedModel<Item>(Item);

        testData = {
            key1: 'value1',
            key2: 'value2',
        };

        fillableData = {
            id: 1,
            key3: 'value3',
        };
    });

    it('should be constructed', () => {
        expect(model).toEqual(jasmine.any(Model));
    });

    it('create() should create new item on model', () => {
        const newItem = model.create(fillableData);

        expect(newItem).toEqual(jasmine.any(Item));
        expect(newItem.get('key3')).toBe(fillableData.key3);
    });

    it('create() should create new item on model only will fillable attrs', () => {
        const attrs = Object.assign(fillableData, testData);

        const newItem = model.create(attrs);

        expect(newItem).toEqual(jasmine.any(Item));
        expect(newItem.get('key1')).toBeUndefined();
        expect(newItem.get('key3')).toBe(fillableData.key3);
    });

    it('create() should throw if no attrs are provided', () => {
        expect(() => model.create({})).toThrow(exception('Item contains no attributes.'));
    });

    it('create() should throw if no attrs provided are fillable', () => {
        expect(() => model.create(testData)).toThrow(
            exception('Item attributes are not permitted during mass assignment.')
        );
    });

    it('updateOrCreate() should create new item', () => {
        const response = model.updateOrCreate([{key: 'id', value: 1}], fillableData);
        expect(response.get('id')).toBe(fillableData.id);
    });

    it('updateOrCreate() should update existing item', () => {
        model.create(fillableData);

        const update = {key3: 'new-value'};

        const response = model.updateOrCreate([{key: 'id', value: 1}], update);
        expect(response.get('key3')).toBe(update.key3);
    });

    it('find() should find the first item with the given id', () => {
        model.create(fillableData);
        model.create(Object.assign(fillableData, {id: 2}));

        const response = model.find(2);

        expect(response.get('id')).toEqual(2);
    });

    it('find() should return undefined when no match found', () => {
        model.create(fillableData);
        model.create(Object.assign(fillableData, {id: 2}));

        const response = model.find(99);

        expect(response).toBeUndefined();
    });

    it('findWhere() should find the first item with the given key value match', () => {
        model.create(fillableData);
        model.create(Object.assign(fillableData, {id: 2}));

        const response = model.findWhere('id', 2);

        expect(response.get('id')).toEqual(2);
    });

    it('findWhere() should return undefined when no match found', () => {
        model.create(fillableData);
        model.create(Object.assign(fillableData, {id: 2}));

        const response = model.findWhere('id', 99);

        expect(response).toBeUndefined();
    });

    it('findByUid() should find the first item with the given uid', () => {
        model.create(fillableData);
        const item = model.create(Object.assign(fillableData, {id: 2}));

        const response = model.findByUid(item.uid());

        expect(response.get('id')).toEqual(2);
    });

    it('findByUid() should return undefined when no match found', () => {
        model.create(fillableData);
        model.create(Object.assign(fillableData, {id: 2}));

        const response = model.findByUid(Symbol());

        expect(response).toBeUndefined();
    });

    it('where() should return items with matching key vales (first item)', () => {
        model.create(fillableData);
        model.create(Object.assign(fillableData, {id: 2}));

        const check = model.where([{key: 'id', value: 1}]);
        expect(check[0].get('id')).toBe(1);
    });

    it('where() should return items with matching key vales (last item)', () => {
        model.create(fillableData);
        model.create(Object.assign(fillableData, {id: 2}));

        const check = model.where([{key: 'id', value: 2}]);
        expect(check[0].get('id')).toBe(2);
    });

    it('where() should return items with matching key vales (multiple attrs)', () => {
        model.create(fillableData);
        model.create(Object.assign(fillableData, {id: 2}));

        const check = model.where([{key: 'id', value: 2}, {key: 'key3', value: 'value3'}]);
        expect(check.length).toBe(1);
        expect(check[0].get('id')).toBe(2);
        expect(check[0].get('key3')).toBe('value3');
    });

    it('where() should return items with matching key vales (not found)', () => {
        model.create(fillableData);
        model.create(Object.assign(fillableData, {id: 2}));

        const check = model.where([{key: 'id', value: 99}]);
        expect(check.length).toBe(0);
    });
});

function exception(message : string) {
    return new ModelException(message);
}
