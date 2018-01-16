import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from './Modal';
import SignUp from './SignUp';
import SignIn from './SignIn';


class ModalController extends Component{
    constructor(props){
        super(props);
        this.renderModal = this.renderModal.bind(this);
    }

    renderModal(){
        switch(this.props.currentModal) {
            case 'SIGN_UP_MODAL':
                return (
                    <SignUp
                        handleHide={this.props.handleHide}
                    />
                );
            case 'SIGN_IN_MODAL':
                return (
                    <SignIn
                        handleHide={this.props.handleHide}
                    />
                );
            default:
                return null;
        }
    }

    render() {
        return (
            <Modal>
                {this.renderModal()}
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