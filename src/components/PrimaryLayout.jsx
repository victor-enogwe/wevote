import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import News from './Pages/News';
import HomePage from './Pages/HomePage';
import VoterReadiness from './Pages/VoterReadiness';
import ModalController from './Modals/ModalController';

import { selectModal } from '../actions/userActions';
import actionTypes from '../actions/constants';

const { SIGN_UP_MODAL, SIGN_IN_MODAL } = actionTypes;

class PrimaryLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {showModal: false};

        this.handleShow = this.handleShow.bind(this);
        this.handleHide = this.handleHide.bind(this);
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

                    WeVote App
                    <button
                        onClick={() => this.handleShow(SIGN_UP_MODAL)}
                    >Sign Up
                    </button>
                    <button
                        onClick={() => this.handleShow(SIGN_IN_MODAL)}
                    >Sign In
                    </button>
                    {this.state.showModal &&
                    <ModalController
                        handleShow={this.handleShow}
                        handleHide={this.handleHide}
                    />}
                </header>
                <main>
                    <Route path="/" exact component={HomePage} />
                    <Route path="/voter-readiness" component={VoterReadiness} />
                    <Route path="/news" component={News} />
                </main>
                <footer>
                    App Footer
                </footer>
            </div>
        );
    }
}

export default connect(null, { selectModal })(PrimaryLayout);