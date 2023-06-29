const isEmpty = (data) => {
    if (Array.isArray(data)) {
        return data.length === 0;
    } else if (typeof data === 'object') {
        return isEmptyObj(data);
    } else {
        return data === null;
    }
};

function isExist(data) {
    return typeof data !== 'undefined';
}

function isError(data) {
    return data instanceof Error;
}

function isEmptyObj(obj) {
    for (const key in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

export default {isEmpty, isExist, isError};
