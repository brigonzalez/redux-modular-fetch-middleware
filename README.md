# redux-modular-fetch-middleware
A modular redux middleware for using fetch

### Getting Started
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
And that's it! A fetch object with a url property is all you need to call `fetch` on a dispatch call.

Of course, being able to call fetch on a dispatch without being provided hooks whenever that action fails or succeeds isn't very useful. Those options are provided through the properties shown below.

**Required Properties**
- `url` The url that will be called by fetch

**Optional Properties**
- `onFailure` The function that will be called if the fetch request fails. Called with `dispatch`, `getState`, and `error`
- `onSuccess` The function that will be called if the fetch request succeeds. Called with `dispatch`, `getState`, and `data` if json is returned
- `options` Fetch options like `method`, and `body`

Examples to follow...

Future upgrades include being able to retrieve data other than json... And any suggestions from you guys