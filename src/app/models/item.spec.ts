import {Item} from './item';

class AbstractedItem extends Item {}

describe('Item', () => {
    let service, testData;

    beforeEach(() => {
        service = new AbstractedItem();

        testData = {
            key1: 'value1',
            key2: 'value2',
        };
    });

    it('should be constructed', () => {
        expect(service).toEqual(jasmine.any(Item));

        expect(typeof service.uid()).toEqual('symbol');
    });

    it('create() should mass assign data to item and return instance of service', () => {
        const response = service.create(testData);

        expect(response).toEqual(jasmine.any(Item));

        expect(service.get('key1')).toBe(testData.key1);
    });

    it('get() should return select item attrs', () => {
        service.create(testData);

        const getKey1 = service.get('key1');
        expect(getKey1).toEqual(testData.key1);

        const getKey3 = service.get('key3');
        expect(getKey3).toBeUndefined();

        const getMultiple = service.get(['key1', 'key2', 'key3']);

        expect(getMultiple[0]).toEqual(testData.key1);
        expect(getMultiple[1]).toEqual(testData.key2);
        expect(getMultiple[2]).toBeUndefined();
    });

    it('equals() should return attr and value equality', () => {
        service.create(testData);

        expect(service.equals('key1', testData.key1)).toEqual(true);
        expect(service.equals('key1', 'value3')).toEqual(false);
    });

    it('uid() should return items symbol', () => {
        const uid = service.uid();
        expect(typeof uid).toEqual('symbol');

        const item2 = new AbstractedItem();
        expect(item2.uid()).not.toBe(uid);// Should be unique
    });

    it('isUuid() should return symbol and value equality', () => {
        const uid = service.uid();

        expect(service.isUid(uid)).toEqual(true);
    });
});
