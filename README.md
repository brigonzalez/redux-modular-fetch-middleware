# redux-modular-fetch-middleware
A modular redux middleware for using fetch

### Getting Started
- Download `redux-modular-fetch-middleware` using `npm` or `yarn`
- Use redux's [`applyMiddleware`](https://redux.js.org/api-reference/applymiddleware) and pass in the default export from `redux-modular-fetch-middleware`, like so...
```javascript
import fetchMiddleware from 'redux-modular-fetch-middleware';
...
applyMiddleware(fetchMiddleware);
```
- Define a `fetch` object with a `url` property on the dispatch you want to call fetch (the action type does not matter)
```javascript
const actionCreatorMethod = () => ({
    fetch: {
        url: 'https://mdn.github.io/fetch-examples/fetch-json/products.json'
    },
    type: SOME_ACTION_TYPE
});
```
That's it! A `fetch` object with a `url` property is all you need to call fetch on a dispatch call.
- `fetch` The required object on a dispatch call to call fetch
- `url` The url that will be called by fetch

You can define what the request method, body, and headers look like. In fact, any options that you can define in fetch will be passed on just as if you were calling `fetch` normally. By default `GET` is used for as the `method`.
- `options` Fetch options with properties like `method`, `header`, and `body`

If you're retrieving data, you can define what [response method](https://developer.mozilla.org/en-US/docs/Web/API/Body) will be used to retrieve that data.
- `responseMethod` Response method used to retrieve data. By default `json` will be used as the response method if the header content-type is 'application/json'. **Warning:** If your fetch call does not return data that is not resolvable by the `responseMethod` provided, the Promise will be rejected.

Being able to call fetch on a dispatch call without being provided hooks whenever that action fails or succeeds isn't very useful. Those options are provided through the properties shown below.
- `onFailure` The function that will be called if the fetch request fails. Called with `dispatch`, `getState`, and `error`
- `onSuccess` The function that will be called if the fetch request succeeds. Called with `dispatch`, `getState`, and `data`

**Required Object**
- `fetch` The required object on a dispatch call to call fetch

**Required Properties on `fetch` Object**
- `url` The url that will be called by fetch

**Optional Properties on `fetch` Object**
- `onFailure` The function that will be called if the fetch request fails. Called with `dispatch`, `getState`, and `error`
- `onSuccess` The function that will be called if the fetch request succeeds. Called with `dispatch`, `getState`, and `data`
- `options` Fetch options with properties like `method`, `header`, and `body`. By default, `GET` will be used as the request method
- `responseMethod` The [response method](https://developer.mozilla.org/en-US/docs/Web/API/Body) used to retrieve data. By default `json` will be used as the response method if the header content-type is 'application/json'. **Warning:** If your fetch call does not return data that is not resolvable by the `responseMethod` provided
    - 'arrayBuffer'
    - 'blob'
    - 'formData'
    - 'json'
    - 'text'

**Fetch Implementation**
The fetch implementation can be defined by passing it in as the parameter when applying redux middleware like so...
```javascript
import crossFetch from 'cross-fetch';
import fetchMiddleware from 'redux-modular-fetch-middleware';
...
applyMiddleware(fetchMiddleware(crossFetch));
```

More examples to follow...
