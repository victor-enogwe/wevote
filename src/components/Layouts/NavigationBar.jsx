import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, NavLink, Link } from 'react-router-dom';

import { selectModal, getUser } from '../../actions/userActions';
import { getUserVri } from '../../actions/vriActions';

import actionTypes from '../../actions/constants';
import setAccessToken from "../../utils/setAccessToken";
import generateBatteryInfo from '../../utils/generateBatteryInfo';

import ModalController from '../Modals/ModalController';

const { SIGN_UP_MODAL, SIGN_IN_MODAL } = actionTypes;

class NavigationBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            navOpen: false,
            notifications: 'You do not have any notification at the moment',
            batteryType: 'empty',
            batteryColor: 'red',
            batteryNotification: 'You have not checked your voter readiness yet. ' +
            'Click on the link to check it now.'
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleHide = this.handleHide.bind(this);
        this.toggleNav = this.toggleNav.bind(this);
        this.closeNav = this.closeNav.bind(this);
        this.logout = this.logout.bind(this);
        this.batteryTitle = this.batteryTitle.bind(this);
    }

    componentWillMount(){
        if(this.props.user.isAuthenticated){
            this.props.getUser(this.props.user.uuid);
            this.props.getUserVri();
        }
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.vriScore !== this.props.vriScore){
            const {batteryType, batteryColor, batteryNotification} = generateBatteryInfo(nextProps.vriScore);
            this.setState({ batteryType, batteryColor, batteryNotification });
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

    closeNav(){
        if (this.state.navOpen) this.toggleNav();
    }

    logout(){
        localStorage.removeItem('wevote');
        setAccessToken(null);
        location.reload();
    }

    batteryTitle(){
        const { batteryType } = this.state;
        if (batteryType === 'battery-empty') return 'You have not checked your Voter Readiness yet';
        if (batteryType === 'battery-quarter') return 'Register and get your PVC to improve your VRI';
    }

    render(){
        const { navOpen, batteryType, batteryColor, batteryNotification, notifications } = this.state;
        const { user } = this.props;
        return (
            <nav className="nav-bar" role="navigation">
                <h1 className="nav-brand"><Link to="/">WeVote</Link></h1>
                {user.isAuthenticated && <span
                    className="far fa-bell fa-lg nav-notification"
                    data-tooltip={notifications}
                >
                </span>}
                <span
                    onClick={this.toggleNav}
                    className={navOpen ? `fa-times fas fa-lg nav-hamburger` : `fa-bars fas fa-lg nav-hamburger`}
                >
                </span>
                <ul className={navOpen ? `nav-menu open` : `nav-menu`}>
                    <li className="vri-nav" onClick={this.closeNav}>
                        <NavLink to="/voter-readiness">Voter Readiness</NavLink>
                        <span
                            className={`tooltip fas fa-lg fa-battery-${batteryType}`} style={{color: batteryColor}}
                            data-tooltip={batteryNotification}
                        >
                        </span>
                    </li>
                    <li onClick={this.closeNav}><NavLink to="/news">News</NavLink></li>
                    <li className="learn">
                        <a>Learn</a>
                        <ul>
                            <li onClick={this.closeNav}><NavLink to="/know-your-candidates">Know Your Candidates</NavLink></li>
                            <li onClick={this.closeNav}><NavLink to="/election-structure">Election Structure</NavLink></li>
                        </ul>
                    </li>
                    {user.isAuthenticated && <li onClick={this.closeNav}>
                        <button
                            onClick={this.logout}
                            className="log-out-button"
                        >
                            Logout
                        </button>
                    </li>}
                    {!user.isAuthenticated && <li
                        onClick={() => {
                            this.handleShow(SIGN_IN_MODAL);
                            this.closeNav()
                        }}
                    >
                        Login
                    </li>}
                    {!user.isAuthenticated && <li onClick={this.closeNav}>
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
        user: state.user,
        vriScore: state.vri.score
    };
}

export default connect(mapStateToProps, { selectModal, getUser, getUserVri })(NavigationBar);
