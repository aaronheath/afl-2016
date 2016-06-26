export declare type BasicObj = BasicObjStr | BasicObjNum;

export interface BasicObjStr {
    [x: string]: any;
}

export interface BasicObjNum {
    [x: number]: any;
}

/**
 * Provides the ability to loop through a simple 1 layer object
 *
 * @param data
 * @param callback
 * @returns {any|({}&IBasicObj)}
 */
function loopObj(data : BasicObj, callback : Function) : BasicObj {
    const _data = copy(data);

    for(const key in _data) {
        if (!_data.hasOwnProperty(key)) {
            continue;
        }

        _data[key] = callback(_data[key], key);
    }

    return _data;
}

/**
 * Basic object to array converter.
 * Discards the objects key.
 *
 * @param obj
 * @returns {Array}
 */
function objectToArray(obj : BasicObj) : any[] {
    const response = [];

    loopObj(obj, (value) => {
        response.push(value);
    });

    return response;
}

/**
 * Returns the value from a datastore object.
 *
 * Datastore object format:
 * ```
 * {
 *   key: {
 *     attr: x
 *   }
 *
 * ```
 *
 * @param datastore
 * @param key
 * @param attr
 * @returns {*}
 */
function getDatastoreAttr(datastore : BasicObj, key : string | number, attr : string | number) : any {
    if(!datastore[key]) {
        return;
    }

    return datastore[key][attr];
}

/**
 * Simple copy of an object
 *
 * @param obj
 * @returns {any|({}&U)}
 */
function copy<T>(obj : T) : T {
    return Object.assign({}, obj);
}

/**
 * Mixins runtime func
 * Ref: https://github.com/Microsoft/TypeScript-Handbook/blob/master/pages/Mixins.md
 *
 * @param derivedCtor
 * @param baseCtors
 */
function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}

/**
 * Returns integer 0 if value is falsy.
 *
 * @param value
 * @returns {any|number}
 */
function zeroUndef(value: any) {
    return value || 0;
}

export {
    loopObj,
    objectToArray,
    getDatastoreAttr,
    copy,
    applyMixins,
    zeroUndef,
};
