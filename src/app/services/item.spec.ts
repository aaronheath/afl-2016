import {provide} from '@angular/core';
import {beforeEachProviders, describe, expect, inject, it} from '@angular/core/testing';
//import 'jasmine';

import {Item as ItemService} from './item';

// TODO Convert these tests over to not require Angular.

describe('ItemService', () => {
    const providers = [
        ItemService,
    ];

    beforeEachProviders(() => providers);

    let testData;

    beforeEach(() => {
        testData = {
            key1: 'value1',
            key2: 'value2',
        };
    });

    it('should be constructed', inject([ItemService], (service: ItemService) => {
        expect(service).toEqual(jasmine.any(ItemService));

        // TODO test that symbol is set
    }));

    it('create() should mass assign data to item and return instance of service', inject([ItemService], (service: ItemService) => {
        const response = service.create(testData);

        expect(response).toEqual(jasmine.any(ItemService));

        expect(service.get('key1')).toBe(testData.key1);
    }));

    it('get() should return select item attrs', inject([ItemService], (service: ItemService) => {
        service.create(testData);

        const getKey1 = service.get('key1');

        expect(getKey1).toEqual(testData.key1);

        const getMultiple = service.get(['key1', 'key2']);

        expect(getMultiple[0]).toEqual(testData.key1);
        expect(getMultiple[1]).toEqual(testData.key2);
    }));

    it('equals() should return attr and value equality', inject([ItemService], (service: ItemService) => {
        service.create(testData);

        expect(service.equals('key1', testData.key1)).toEqual(true);
        expect(service.equals('key1', 'value3')).toEqual(false);
    }));

    it('uid() should return items symbol', inject([ItemService], (service: ItemService) => {
        const uid = service.uid();

        expect(typeof uid).toEqual('symbol');

        // It should be unique
        const item2 = new ItemService();
        expect(item2.uid()).not.toBe(uid);
    }));

    it('isUuid() should return symbol and value equality', inject([ItemService], (service: ItemService) => {
        const uid = service.uid();

        expect(service.isUid(uid)).toEqual(true);
    }));
});
