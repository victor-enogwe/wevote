import React from 'react';

import TextInput from '../Forms/TextInput';

const Surname = ({ handleChange, onLoginSubmit, signInDetails, errors }) => (
    <section className="surname-login">
        <div className="question">
            <p>
                Please enter your surname
            </p>
        </div>
        <form onSubmit={onLoginSubmit} className="login-form">
            <TextInput
                id="login-surname"
                name="surname"
                type="text"
                placeholder="Surname"
                icon="fas fa-user fa-lg"
                handleChange={handleChange}
                value={signInDetails.surname}
                error={errors.surname}
            />
            <div className="submit-button">
                <button
                    onClick={onLoginSubmit}
                    type="button"
                >
                    Login
                </button>
            </div>
        </form>
    </section>
);

export default Surname;
