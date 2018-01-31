import React, { Component } from 'react';
import { connect } from 'react-redux';
import toastr from 'toastr';

import { signUp, signIn } from "../../actions/userActions";
import { handleError } from "../../utils/errorHandler";

import Modal from './Modal';
import SignUp from './SignUp';
import SignInForm from '../Forms/SignInForm';
import SignUpForm from '../Forms/SignUpForm';


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
                </div>
            </Modal>
        );
    }
}

function mapStateToProps(state){
    return {
        currentModal: state.currentModal
    }
}

export default connect(mapStateToProps, { signUp, signIn })(ModalController);
