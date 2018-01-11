import React from 'react';
import HomePage from './Pages/HomePage';
import { Route } from 'react-router-dom';

const PrimaryLayout = () => (
    <div className="primary-layout">
        <header>
            Our React Router 4 App
        </header>
        <main>
            <Route path="/" exact component={HomePage} />
        </main>
        <footer>
            App Footer
        </footer>
    </div>
);

export default PrimaryLayout;