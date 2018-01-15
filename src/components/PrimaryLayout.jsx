import React from 'react';
import HomePage from './Pages/HomePage';
import { Route } from 'react-router-dom';
import VoterReadiness from './Pages/VoterReadiness'

const PrimaryLayout = () => (
    <div className="primary-layout">
        <header>
            Our React Router 4 App
        </header>
        <main>
            <Route path="/" exact component={HomePage} />
            <Route path="/voter_readiness" component={VoterReadiness} />
        </main>
        <footer>
            App Footer
        </footer>
    </div>
);

export default PrimaryLayout;