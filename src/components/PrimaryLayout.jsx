import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

import News from './Pages/News';
import HomePage from './Pages/HomePage';
import NavigationBar from './Layouts/NavigationBar';
import VoterReadiness from './Pages/VoterReadiness'

class PrimaryLayout extends Component {
    render() {
        return (
            <div className="primary-layout">
                <header>
                    <NavigationBar />
                </header>
                <main className="container">
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
