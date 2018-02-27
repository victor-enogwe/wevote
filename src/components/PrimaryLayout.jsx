import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { login, selectModal } from '../actions/userActions';
import actionTypes from '../actions/constants';
const { SIGN_IN_AJAX } = actionTypes;

import News from './Pages/News';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import NavigationBar from './Layouts/NavigationBar';
import VoterReadiness from './Pages/VoterReadiness';
import Candidates from './Pages/Candidates';
import ElectionStructure from './Pages/ElectionStructure';
import ModalController from './Modals/ModalController';

import loader from '../assets/loader.gif';

class PrimaryLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleHide = this.handleHide.bind(this);
    }

    componentWillMount(){
        if (localStorage.getItem('wevote')) {
            const tokenStorage = JSON.parse(localStorage.getItem('wevote'));
            const token = tokenStorage.jwt;
            if (token) {
                this.props.login(token, SIGN_IN_AJAX);
            }
        }
    }

    handleShow(modal) {
        this.setState({showModal: true});
        this.props.selectModal(modal);
    }

    handleHide() {
        this.setState({showModal: false});
    }

    render() {
        return (
            <div className="primary-layout">
                <header>
                    <Route path="*" component={NavigationBar} />
                </header>
                <main className="container">
                    <Route path="/" exact component={HomePage} />
                    <Route path="/login" component={LoginPage} />
                    <Route path="/voter-readiness"  component={VoterReadiness} />
                    <Route path="/news" component={News} />
                    <Route path="/know-your-candidates" component={Candidates} />
                    <Route path="/election-structure" component={ElectionStructure} />
                    <Route path="*" render={() => this.props.loading && <img className="loader" src={loader} />}/>
                </main>
                <footer>
                    <p>WeVote</p>
                    <p>&copy; All Rights Reserved</p>
                </footer>
                {this.state.showModal &&
                <ModalController
                    handleShow={this.handleShow}
                    handleHide={this.handleHide}
                />}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        loading: state.ajaxCallsInProgress > 0
    };
}

export default withRouter(connect(mapStateToProps, { login, selectModal })(PrimaryLayout));
