import React, {Component} from 'react';
import { connect } from 'react-redux';

const VoterReadiness = ({ hasVRI, VRI }) => (
  <div>
    { hasVRI ? <p>Your VRI is { VRI }</p> : <div> Take VRI </div> }
  </div>
);

export default VoterReadiness;