import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

const middleware = [thunk];

/**
 * Single Store
 * @returns {function} store configuration
 */
export default function configureStore() {
    return createStore(
        rootReducer,
        compose(
            applyMiddleware(...middleware),
            window.__REDUX_DEVTOOLS_EXTENSION__
                ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
        )
    );
}

