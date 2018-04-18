import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from "redux-logger";
import { persistStore } from 'redux-persist';
import reducers from './../reducers';

const middleware = [thunk];
middleware.push(createLogger());

const store = createStore(
    reducers,
    undefined,
    compose(
        applyMiddleware(...middleware)
    )
);
persistStore(store)
export default store;