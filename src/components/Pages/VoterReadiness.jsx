import React, {Component} from 'react';
import { connect } from 'react-redux';
import VriForm from '../Snippets/VriForm';

const VoterReadiness = ({ handleShow }) => (
    <VriForm handleShow={handleShow} />
);

export default VoterReadiness;
