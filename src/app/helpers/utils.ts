/**
 * Types
 */

export declare type BasicObj = BasicObjStr | BasicObjNum;

/**
 * Interfaces
 */

export interface BasicObjStr {
    [x: string]: any;
}

export interface BasicObjNum {
    [x: number]: any;
}

/**
 * Provides the ability to loop through a simple 1 layer object
 *
 * TODO remove and replace usage with lodash method.
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
 * Simple copy of an object
 *
 * TODO remove, only used by loopObj.
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
 * TODO review whether required, we're not using mixins so far.
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
    copy,
    applyMixins,
    zeroUndef,
};
