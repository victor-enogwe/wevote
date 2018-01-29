import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import News from './Pages/News';
import HomePage from './Pages/HomePage';
import VoterReadiness from './Pages/VoterReadiness';
import NavigationBar from './Layouts/NavigationBar';

class PrimaryLayout extends Component {
    render() {
        return (
            <div className="primary-layout">
                <header>
                    <NavigationBar />
                </header>
                <main>
                    <Route path="/" exact component={HomePage} />
                    <Route path="/voter-readiness" component={VoterReadiness} />
                    <Route path="/news" component={News} />
                </main>
                <footer>
                    <p>WeVote</p>
                    <p>&copy; All Rights Reserved</p>
                </footer>
            </div>
        );
    }
}

export default PrimaryLayout;