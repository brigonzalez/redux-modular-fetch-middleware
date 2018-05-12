const callCallbackIfProvided = (callback, ...args) => {
    if (callback && typeof callback === 'function') {
        callback(...args); // eslint-disable-line callback-return
    }
};

const defaultJsonResponseMethod = (response, store, action) => {
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
        response.json().then((data) => {
            callCallbackIfProvided(action.fetch.onSuccess, store.dispatch, store.getState, data);
        });
    } else {
        callCallbackIfProvided(action.fetch.onSuccess, store.dispatch, store.getState);
    }
};

const responseMethod = (response, store, action) => {
    if (response[action.fetch.responseMethod]) {
        return response[action.fetch.responseMethod]().then((data) => {
            callCallbackIfProvided(action.fetch.onSuccess, store.dispatch, store.getState, data);
        });
    }

    return defaultJsonResponseMethod(response, store, action);
};

// eslint-disable-next-line max-params
const callFetchService = (fetchImplementation, store, action, next) => {
    next(action);

    return fetchImplementation(action.fetch.url, {
        ...action.fetch.options
    }).then((response) => responseMethod(response, store, action), (error) => {
        callCallbackIfProvided(action.fetch.onFailure, store.dispatch, store.getState, error);
    });
};

export default (fetchImplementation = window.fetch) => (store) => (next) => (action) => {
    if (action.fetch) {
        return callFetchService(fetchImplementation, store, action, next);
    }

    return next(action);
};
