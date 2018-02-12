import React, { Component } from 'react';
import { connect } from 'react-redux';
import toastr from 'toastr';

import { signUp, signIn, facebookAuth, twitterAuth } from "../../actions/userActions";
import { handleError } from "../../utils/errorHandler";
import * as validate from '../../utils/validate';

import Modal from './Modal';
import SignUp from './SignUp';
import SignInForm from '../Forms/SignInForm';
import SignUpForm from '../Forms/SignUpForm';

import loader from '../../assets/loader.gif';

class ModalController extends Component{
    constructor(props, context){
        super(props, context);
        this.state = {
            showPassword: false,
            signUpDetails: {
                firstname: '',
                surname: '',
                phone: '',
                sex: '',
                age: '',
                email: '',
                password: ''
            },
            signInDetails: {
                email: '',
                password: ''
            },
            signUpErrors: {},
            signInErrors: {}
        };
        this.toggleShowPassword=this.toggleShowPassword.bind(this);
        this.handleSignUpChange=this.handleSignUpChange.bind(this);
        this.handleSignInChange=this.handleSignInChange.bind(this);
        this.renderModal = this.renderModal.bind(this);
        this.onSignUpSubmit = this.onSignUpSubmit.bind(this);
        this.onSignInSubmit = this.onSignInSubmit.bind(this);
        this.facebookAuthentication = this.facebookAuthentication.bind(this);
        this.twitterAuthentication = this.twitterAuthentication.bind(this);
    }

    onSignUpSubmit(event) {
        event.preventDefault();
        const { valid, errors } = validate.signUp(this.state.signUpDetails);
        if (valid) {
            this.props.signUp(this.state.signUpDetails)
                .then(() => {
                    if (this.props.user.isAuthenticated) {
                        this.props.handleHide();
                        location.reload();
                        toastr.success('Registration successful');
                    }
                })
                .catch(error => handleError(error));
        } else {
            this.setState({ signUpErrors: errors });
        }
    }

    onSignInSubmit(event) {
        event.preventDefault();
        const { valid, errors } = validate.signIn(this.state.signInDetails);
        if (valid) {
            this.props.signIn(this.state.signInDetails)
                .then(() => {
                    if (this.props.user.isAuthenticated) {
                        this.props.handleHide();
                        location.reload();
                    }
                })
                .catch(error => handleError(error));
        } else {
            this.setState({ signInErrors: errors });
        }
    }

    handleSignUpChange(event) {
        const signUpDetails = this.state.signUpDetails;
        signUpDetails[event.target.name] = event.target.value.substr(0, 50);
        this.setState({ signUpDetails });
    }

    handleSignInChange(event) {
        const signInDetails = this.state.signInDetails;
        signInDetails[event.target.name] = event.target.value.substr(0, 50);
        this.setState({ signInDetails });
    }

    facebookAuthentication(){
        this.props.facebookAuth();
    }

    twitterAuthentication(){
        this.props.twitterAuth();
    }

    toggleShowPassword(e){
        e.preventDefault();
        this.setState({showPassword: !this.state.showPassword});
    }

    renderModal(){
        const { handleHide, handleShow } = this.props;
        const { signUpDetails, signUpErrors, signInDetails, signInErrors, showPassword } = this.state;
        switch(this.props.currentModal) {
            case 'SIGN_UP_MODAL':
                return (
                    <SignUp
                        handleHide={handleHide}
                        handleShow={handleShow}
                        facebookAuth={this.facebookAuthentication}
                        twitterAuth={this.twitterAuthentication}
                    />
                );
            case 'SIGN_IN_MODAL':
                return (
                    <SignInForm
                        handleHide={handleHide}
                        handleShow={handleShow}
                        handleChange={this.handleSignInChange}
                        signInDetails={signInDetails}
                        signInErrors={signInErrors}
                        showPassword={showPassword}
                        toggleShowPassword={this.toggleShowPassword}
                        onSignInSubmit={this.onSignInSubmit}
                        facebookAuth={this.facebookAuthentication}
                        twitterAuth={this.twitterAuthentication}
                    />
                );
            case 'SIGN_UP_FORM':
                return (
                    <SignUpForm
                        handleHide={handleHide}
                        handleShow={handleShow}
                        handleChange={this.handleSignUpChange}
                        signUpDetails={signUpDetails}
                        signUpErrors={signUpErrors}
                        showPassword={showPassword}
                        toggleShowPassword={this.toggleShowPassword}
                        onSignUpSubmit={this.onSignUpSubmit}
                    />
                );
            default:
                return null;
        }
    }

    render() {
        return (
            <Modal>
                <div className="modal">
                    {this.renderModal()}
                    {this.props.loading && <img className="loader" src={loader} />}
                </div>
            </Modal>
        );
    }
}

function mapStateToProps(state){
    return {
        currentModal: state.currentModal,
        loading: state.ajaxCallsInProgress > 0,
        user: state.user
    }
}

export default connect(mapStateToProps, { signUp, signIn, facebookAuth, twitterAuth })(ModalController);
