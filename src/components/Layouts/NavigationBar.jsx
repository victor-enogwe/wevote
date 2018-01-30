import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { selectModal } from '../../actions/userActions';
import actionTypes from '../../actions/constants';

import ModalController from '../Modals/ModalController';

const { SIGN_UP_MODAL, SIGN_IN_MODAL } = actionTypes;

class NavigationBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            navOpen: false
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleHide = this.handleHide.bind(this);
        this.toggleNav = this.toggleNav.bind(this);
    }

    handleShow(modal) {
        this.setState({showModal: true});
        this.props.selectModal(modal);
    }

    handleHide() {
        this.setState({showModal: false});
    }

    toggleNav(){
        this.setState({navOpen: !this.state.navOpen})
    }

    render(){
        const { navOpen } = this.state;
        return (
            <nav className="nav-bar" role="navigation">
                <h1 className="nav-brand"><a href="/">WeVote</a></h1>
                <span
                    className="far fa-bell fa-lg nav-notification"
                >

                </span>
                <span
                    onClick={this.toggleNav}
                    className={navOpen ? `fa-times fas fa-lg nav-hamburger` : `fa-bars fas fa-lg nav-hamburger`}
                >

                </span>
                <ul className={navOpen ? `nav-menu open` : `nav-menu`}>
                    <li><Link to="/voter-readiness">Voter Readiness</Link></li>
                    <li><Link to="/news">News</Link></li>
                    <li
                        onClick={() => this.handleShow(SIGN_IN_MODAL)}
                    >
                        Login
                    </li>
                    <li>
                        <button
                            onClick={() => this.handleShow(SIGN_UP_MODAL)}
                            className="sign-up-button"
                        >
                            Sign Up
                        </button>
                    </li>
                </ul>
                {this.state.showModal &&
                <ModalController
                    handleShow={this.handleShow}
                    handleHide={this.handleHide}
                />}
            </nav>
        );
    }
}

export default connect(null, { selectModal })(NavigationBar);