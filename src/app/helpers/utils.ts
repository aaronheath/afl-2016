/**
 * Provides the ability to loop through a simple 1 layer object
 *
 * @param data
 * @param callback
 * @returns {any|({}&IBasicObj)}
 */
function loopObj(data : IBasicObj, callback : Function) : IBasicObj {
    const _data = copy(data);

    for(const key in _data) {
        if (!_data.hasOwnProperty(key)) {
            continue;
        }

        callback(_data[key], key);
    }

    return _data;
}

function objectToArray(obj) {
    const response = [];

    loopObj(obj, (value) => {
        response.push(value);
    });

    return response;
}

function getDatastoreAttr(datastore, key, attr) {
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

export {
    loopObj,
    objectToArray,
    getDatastoreAttr,
    copy,
};
