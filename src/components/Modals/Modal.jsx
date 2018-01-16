import React, { Component } from 'react';
import { createPortal } from 'react-dom';

const modalRoot = document.getElementById('modal-root');

class Modal extends Component {
    constructor(props) {
        super(props);
        this.modalElement = document.createElement('div');
    }

    componentDidMount() {
        modalRoot.appendChild(this.modalElement);
    }

    componentWillUnmount() {
        modalRoot.removeChild(this.modalElement);
    }

    render() {
        return createPortal(
            this.props.children,
            this.modalElement,
        );
    }
}

export default Modal;