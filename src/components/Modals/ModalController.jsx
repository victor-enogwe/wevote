import React, { Component } from 'react';
import { connect } from 'react-redux';
import toastr from 'toastr';

import { signUp, signIn, facebookAuth, twitterAuth } from "../../actions/userActions";
import { handleError } from "../../utils/errorHandler";

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
            }
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
        this.props.signUp(this.state.signUpDetails)
            .then(() => {
                this.props.handleHide();
                location.reload();
                toastr.success('You have signed up successfully');
            })
            .catch(error => handleError(error));
    }

    onSignInSubmit(event) {
        event.preventDefault();
        this.props.signIn(this.state.signInDetails)
            .then(() => {
                this.props.handleHide();
                location.reload();
            })
            .catch(error => handleError(error));
    }

    handleSignUpChange(event) {
        const signUpDetails = this.state.signUpDetails;
        signUpDetails[event.target.name] = event.target.value;
        this.setState({ signUpDetails });
    }

    handleSignInChange(event) {
        const signInDetails = this.state.signInDetails;
        signInDetails[event.target.name] = event.target.value;
        this.setState({ signInDetails });
    }

    facebookAuthentication(){
        this.props.facebookAuth();
        this.props.handleHide();
    }

    twitterAuthentication(){
        this.props.twitterAuth();
        this.props.handleHide();
    }

    toggleShowPassword(e){
        e.preventDefault();
        this.setState({showPassword: !this.state.showPassword});
    }

    renderModal(){
        const { handleHide, handleShow } = this.props;
        const { signUpDetails, signInDetails, showPassword } = this.state;
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
                        handleChange={this.handleSignInChange}
                        signInDetails={signInDetails}
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
                        handleChange={this.handleSignUpChange}
                        signUpDetails={signUpDetails}
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
        loading: state.ajaxCallsInProgress > 0
    }
}

export default connect(mapStateToProps, { signUp, signIn, facebookAuth, twitterAuth })(ModalController);
