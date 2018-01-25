import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from './Modal';
import SignUp from './SignUp';
import SignInForm from '../Forms/SignInForm';
import SignUpForm from '../Forms/SignUpForm';


class ModalController extends Component{
    constructor(props){
        super(props);
        this.state = {
            showPassword: false,
            signUpDetails: {
                first_name: '',
                last_name: '',
                phone_number: '',
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
        console.log('ShowPassword', this.state.showPassword);
        e.preventDefault();
        this.setState({showPassword: !this.state.showPassword});
    }

    renderModal(){
        console.log('SignupDetails', this.state.signUpDetails);
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

export default connect(mapStateToProps)(ModalController);