export function loopObj(data, callback) {
    const _data = Object.assign({}, data);

    for(const key in _data) {
        if (!_data.hasOwnProperty(key)) {
            continue;
        }

        callback(_data[key], key);
    }

    return _data;
}

export function objectToArray(obj) {
    const response = [];

    loopObj(obj, (value) => {
        response.push(value);
    });

    return response;
}

export function getDatastoreAttr(datastore, key, attr) {
    if(!datastore[key]) {
        return;
    }

    return datastore[key][attr];
}
