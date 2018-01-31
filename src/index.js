import React from 'react';
import { render } from 'react-dom';

import App from './components/App';

import './stylesheets/main.scss';
import './assets/progressbar.js'

render (
    <App />,
    document.getElementById('app'),
);
