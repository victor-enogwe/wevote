import React, { Component } from 'react';

import Phone from '../Snippets/Phone';
import Surname from '../Snippets/Surname';

import * as validate from "../../utils/validate";
import actionTypes from '../../actions/constants';
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
        console.log('Valid', valid, 'Errors', errors);
        if (valid) {
            this.goToNext(SURNAME);
        } else {
            this.setState({ errors });
        }
    }

    onLoginSubmit() {
        event.preventDefault();
        const { valid, errors } = validate.surname(this.state.signInDetails);
        console.log('Valid', valid, 'Errors', errors);
        if (valid) {
            console.log('Saved');
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

export default LoginPage;
