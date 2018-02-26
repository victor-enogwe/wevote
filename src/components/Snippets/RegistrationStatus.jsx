import React from 'react';
import voter from '../../assets/voter.jpg';

import actionTypes from '../../actions/constants';

const { YEAR, BIO } = actionTypes;

const RegistrationStatus = ({ handleChange, goTo }) => (
    <section className="status">
        <div className="question">
            <p>
                Have you registered as a voter?
            </p>
        </div>
        <div className="q-image">
            <img src={voter} />
        </div>
        <div className="options">
            <input
                onClick={(event) => {
                    handleChange(event);
                    goTo(YEAR)
                }}
                value="Yes"
                type="submit"
                name="Q5"
                id="A"
            />
            <input
                onClick={(event) => {
                    handleChange(event);
                    goTo(BIO)
                }}
                value="No"
                type="submit"
                name="Q5"
                id="B"
            />
        </div>
    </section>
);

export default RegistrationStatus;
