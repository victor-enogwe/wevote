import React from 'react';
import { Link } from 'react-router-dom';
import vote from '../../assets/vote.png';

import actionTypes from '../../actions/constants';

const { CARD } = actionTypes;

const Start = ({ handleChange, goTo }) => (
    <section className="start">
        <div className="question">
            <p>
                The Voter Readiness Index helps you know what is required of you to vote and if you've met
                those requirements. The following questions will give you an overview of your level of
                readiness for the upcoming elections.
            </p>
        </div>
        <div className="q-image">
            <img src={vote} />
        </div>
        <div className="options">
            <button
                onClick={(event) => {
                    handleChange(event);
                    goTo(CARD)
                }}
                type="button"
                name="Q1"
                id="A"
            >
                Continue &raquo;
            </button>
        </div>
        <div className="done">
            Already taken the VRI test?
            <Link to="/login"> Click here to login </Link>
        </div>
    </section>
);

export default Start;
