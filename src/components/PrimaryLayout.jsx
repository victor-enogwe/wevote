import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { login } from '../actions/userActions';
import actionTypes from '../actions/constants';
const { SIGN_IN } = actionTypes;

import News from './Pages/News';
import HomePage from './Pages/HomePage';
import NavigationBar from './Layouts/NavigationBar';
import VoterReadiness from './Pages/VoterReadiness'

class PrimaryLayout extends Component {

    componentWillMount(){
        if (localStorage.getItem('wevote')) {
            const tokenStorage = JSON.parse(localStorage.getItem('wevote'));
            const token = tokenStorage.jwt;
            if (token) {
                this.props.login(token, SIGN_IN);
            }
        }
    }

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

export default withRouter(connect(null, { login })(PrimaryLayout));
