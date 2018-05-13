# redux-modular-fetch-middleware
> A modular redux middleware for using fetch

---
## Table of Contents
1. [Getting Started](#getting-started)
2. [Documentation](#documentation)
3. [Best Practices](#best-practices)
---

### Getting Started
- Download `redux-modular-fetch-middleware` using `npm i redux-modular-fetch-middleware` or `yarn add redux-modular-fetch-middleware`
- Apply the middleware using the `redux-modular-fetch-middleware` default export, like so...
```javascript
import { createStore, applyMiddleware } from 'redux'
import fetchMiddleware from 'redux-modular-fetch-middleware';
...
applyMiddleware(fetchMiddleware);
```
- Define a `fetch` object with a `url` property on the dispatch you want to call fetch
```javascript
const actionCreatorMethod = () => ({
    fetch: {
        url: 'https://someurl.com'
    },
    type: SOME_ACTION_TYPE
});
```
That's it! A `fetch` object with a `url` property is all you need to call fetch on an action.
- `fetch` The required object on a dispatch call to call fetch
- `url` The url that will be called by fetch

<br />

You can define what the request `method`, `body`, and `header` look like. In fact, any options that you can define in fetch natively will be passed on just as if you were calling fetch yourself. By default `GET` is used for as the `method`.
- `options` Fetch options with properties like `method`, `header`, and `body`
```javascript
const setUserActionCreator = () => ({
    fetch: {
        options: {
            body: {
                user: {
                    name: 'First Last',
                    address: '123 Main St.' 
                }
            },
            method: 'POST'
        },
        url: 'https://someapi.com/user'
    },
    type: SET_USER_REQUEST
});
```

<br />

If you're retrieving data, you can define what [response method](https://developer.mozilla.org/en-US/docs/Web/API/Body) will be used to retrieve that data.
- `responseMethod` The [response method](https://developer.mozilla.org/en-US/docs/Web/API/Body) used to retrieve data. By default, `json` will be used as the response method if the `header` content-type is 'application/json'. **Warning:** If a `responseMethod` is provided and your fetch call returns a response that is not resolvable by the `responseMethod` provided, the Promise will be rejected.
```javascript
const getProfilePicActionCreator = (userId) => ({
    fetch: {
        responseMethod: 'blob',
        url: `https://someapi.com/user/${userId}/profilePic`
    },
    type: GET_PROFILE_PIC_REQUEST
});
```

<br />

Being able to call fetch without being able to access the data or error isn't very useful. Those options are provided through the properties shown below.
- `onFailure` The function that will be called if the fetch request fails. Called with `dispatch`, `getState`, and `error`
- `onSuccess` The function that will be called if the fetch request succeeds. Called with `dispatch`, `getState`, and `data`

You are also given the `store`'s current `getState` and `dispatch` function to notify your reducers your request was successful or unsuccessful.

```javascript
const getProfilePicActionCreator = (userId) => ({
    fetch: {
        onFailure: (dispatch, getState, error) => {
            dispatch({
                error: error,
                type: GET_PROFILE_PIC_FAILURE
            });
        },
        onSuccess: (dispatch, getState, data) => {
            dispatch({
                data: data,
                type: GET_PROFILE_PIC_SUCCESS
            });
        },
        responseMethod: 'blob',
        url: `https://someapi.com/user/${userId}/profilePic`
    },
    type: GET_PROFILE_PIC_REQUEST
});
```

<br />

You can even define what fetch implementation you would like the middleware to use when applying the middleware.
```javascript
import crossFetch from 'cross-fetch';
import fetchMiddleware from 'redux-modular-fetch-middleware';
...
applyMiddleware(fetchMiddleware(crossFetch));
```
This can be especially useful when wanting to set global options in your fetch request like `header` and `credentials`. By default, `window.fetch` will be used as the fetch implementation. 

---

### Documentation

**Required Object**
- `fetch` The required object on a dispatch call to call fetch

**Required Properties on `fetch` Object**
- `url` The url that will be called by fetch

**Optional Properties on `fetch` Object**
- `onFailure` The function that will be called if the fetch request fails. Called with `dispatch`, `getState`, and `error`
- `onSuccess` The function that will be called if the fetch request succeeds. Called with `dispatch`, `getState`, and `data`
- `options` Fetch options with properties like `method`, `header`, and `body`. By default, `GET` will be used as the request method
- `responseMethod` The [response method](https://developer.mozilla.org/en-US/docs/Web/API/Body) used to retrieve data. By default, `json` will be used as the response method if the `header` content-type is 'application/json'. **Warning:** If a `responseMethod` is provided and your fetch call returns a response that is not resolvable by the `responseMethod` provided, the Promise will be rejected.
    - 'arrayBuffer'
    - 'blob'
    - 'formData'
    - 'json'
    - 'text'

**Fetch Implementation**

The fetch implementation can be defined by passing it in as the parameter when applying the middleware. By default, `window.fetch` will be used as the fetch implementation.

---

### Best Practices

**Async Actions**

[Redux docs](https://redux.js.org/advanced/async-actions#actions) suggest using three actions for an asynchronous request: an action indicating your request began, an action indicating your request succeeded, and an action indicating your request failed. Below is an example of how to heed this suggestion using `redux-modular-fetch-middleware`.
```javascript
const getUserActionCreator = (userId) => ({
    fetch: {
        onFailure: (dispatch, getState, error) => {
            dispatch({
                error: error,
                type: GET_USER_FAILURE
            });
        },        
        onSuccess: (dispatch, getState, data) => {
            dispatch({
                data: data,
                type: GET_USER_SUCCESS
            });
        },
        url: `https://someapi.com/user/${userId}`
    },
    type: GET_USER_REQUEST
});
```
