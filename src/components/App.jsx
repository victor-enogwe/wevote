import React, {Component} from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import PrimaryLayout from './PrimaryLayout';

import configureStore from "../store/configureStore";

const store = configureStore();


class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <PrimaryLayout />
                </Router>
            </Provider>
        );
    }
}

export default App;
