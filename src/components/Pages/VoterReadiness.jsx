import React, {Component} from 'react';
import { connect } from 'react-redux';
import VriForm from '../Snippets/VriForm';

const VoterReadiness = ({ hasVRI, VRI }) => (
  <div>
    { hasVRI ? <p>Your VRI is { VRI }</p> : <div> <VriForm /> </div> }
  </div>
);

export default VoterReadiness;