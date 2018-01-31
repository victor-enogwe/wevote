import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';

import { selectModal, getUser } from '../../actions/userActions';
import actionTypes from '../../actions/constants';

import ModalController from '../Modals/ModalController';
import setAccessToken from "../../utils/setAccessToken";

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
        this.logout = this.logout.bind(this);
    }

    componentWillMount(){
        if(this.props.user.isAuthenticated){
            this.props.getUser(this.props.user.uuid);
        }
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

    logout(){
        localStorage.removeItem('wevote');
        setAccessToken(null);
        location.reload();
    }

    render(){
        const { navOpen } = this.state;
        const { user } = this.props;
        return (
            <nav className="nav-bar" role="navigation">
                <h1 className="nav-brand"><a href="/">WeVote</a></h1>
                {user.isAuthenticated && <span
                    className="far fa-bell fa-lg nav-notification"
                >
                </span>}
                <span
                    onClick={this.toggleNav}
                    className={navOpen ? `fa-times fas fa-lg nav-hamburger` : `fa-bars fas fa-lg nav-hamburger`}
                >
                </span>
                <ul className={navOpen ? `nav-menu open` : `nav-menu`}>
                    <li><NavLink to="/voter-readiness">Voter Readiness</NavLink></li>
                    <li><NavLink to="/news">News</NavLink></li>
                    <li><NavLink to="/extras">Learn</NavLink></li>
                    {user.isAuthenticated && <li>
                        <button
                            onClick={this.logout}
                            className="log-out-button"
                        >
                            Logout
                        </button>
                    </li>}
                    {!user.isAuthenticated && <li
                        onClick={() => this.handleShow(SIGN_IN_MODAL)}
                    >
                        Login
                    </li>}
                    {!user.isAuthenticated && <li>
                        <button
                            onClick={() => this.handleShow(SIGN_UP_MODAL)}
                            className="sign-up-button"
                        >
                            Sign Up
                        </button>
                    </li>}
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

function mapStateToProps(state){
    return {
        user: state.user
    };
}

export default connect(mapStateToProps, { selectModal, getUser })(NavigationBar);
