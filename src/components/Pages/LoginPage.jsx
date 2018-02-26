import React, { Component } from 'react';
import { connect } from 'react-redux';

import Phone from '../Snippets/Phone';
import Surname from '../Snippets/Surname';

import { confirmPhone, signIn, getUser } from '../../actions/userActions';
import * as validate from "../../utils/validate";
import actionTypes from '../../actions/constants';
import {handleError} from "../../utils/errorHandler";
const { PHONE, SURNAME } = actionTypes;

class LoginPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            section: PHONE,
            signInDetails: {
                phone: '',
                surname: ''
            },
            errors: {}
        };
        this.handleChange = this.handleChange.bind(this);
        this.onPhoneSubmit = this.onPhoneSubmit.bind(this);
        this.onLoginSubmit = this.onLoginSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if (this.props.user.surname !== nextProps.user.surname) {
            this.goToNext(SURNAME);
        }
    }

    handleChange(event) {
        const signInDetails = this.state.signInDetails;
        signInDetails[event.target.name] = event.target.value;
        this.setState({ signInDetails });
    }

    goToNext(section) {
        this.setState({ section });
    }

    onPhoneSubmit() {
        event.preventDefault();
        const { valid, errors } = validate.phone(this.state.signInDetails);
        if (valid) {
            this.props.confirmPhone({phone: this.state.signInDetails.phone});
        } else {
            this.setState({ errors });
        }
    }

    onLoginSubmit() {
        event.preventDefault();
        const { valid, errors } = validate.surname(this.state.signInDetails);
        if (valid) {
            this.props.signIn(this.state.signInDetails)
                .then(() => {
                    if (this.props.user.isAuthenticated) {
                        this.props.getUser(this.props.user.uuid);
                        this.props.history.push('/voter-readiness');
                    }
                })
                .catch(error => handleError(error));
        } else {
            this.setState({ errors });
        }
    }

    render(){
        const { section, signInDetails, errors } = this.state;
        return (
            <div className="login">
                {section === PHONE &&
                <Phone
                    onPhoneSubmit={this.onPhoneSubmit}
                    handleChange={this.handleChange}
                    signInDetails={signInDetails}
                    errors={errors}
                />}
                {section === SURNAME &&
                <Surname
                    onLoginSubmit={this.onLoginSubmit}
                    handleChange={this.handleChange}
                    signInDetails={signInDetails}
                    errors={errors}
                />}
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        user: state.user,
    };
}

export default connect(mapStateToProps, { confirmPhone, signIn, getUser })(LoginPage);
