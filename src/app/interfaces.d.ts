/**
 * ES6 & ES7 FEATURES UNKNOWN TO TYPESCRIPT (AT LEAST FOR NOW)
 *
 * Removes compile error for ES6 Object.assign()
 * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */

/* tslint:disable:interface-name */

interface ObjectConstructor {
    assign(target: any, ...sources: any[]): any;
    is(a: any, b: any);
}

interface Array<T> {
    includes(x) : boolean;
    find(x) : boolean | void;
}
