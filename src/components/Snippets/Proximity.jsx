import React from 'react';
import center from '../../assets/voting-center.jpg';

import actionTypes from '../../actions/constants';

const { BIO } = actionTypes;

const Proximity = ({ handleChange, goTo }) => (
    <section className="proximity">
        <div className="question">
            <p>
                How close is your registration center to your residence?
            </p>
        </div>
        <div className="q-image">
            <img src={center} />
        </div>
        <div className="options">
            <input
                onClick={(event) => {
                    handleChange(event);
                    goTo(BIO)
                }}
                value="Within my City"
                type="submit"
                name="Q3"
                id="A"
            />
            <input
                onClick={(event) => {
                    handleChange(event);
                    goTo(BIO)
                }}
                value="Outside my City"
                type="submit"
                name="Q3"
                id="B"
            />
        </div>
    </section>
);

export default Proximity;
