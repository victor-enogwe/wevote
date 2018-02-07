import React from 'react';

import TextInput from './TextInput';

import actionTypes from '../../actions/constants';

const { SIGN_UP_MODAL } = actionTypes;


const SignIn = ({handleHide, handleShow, handleChange, signInDetails, signInErrors,
                    onSignInSubmit, showPassword, toggleShowPassword}) => (
    <div className="modal-section">
        <section className="inner-modal-section">
            <i onClick={handleHide} className="fas fa-times fa-lg close-modal">
            </i>
            <h2 className="modal-header"> Sign In </h2>
            <div className="facebook social-buttons sign-in-social-buttons">
                <i className="fab fa-facebook fa-lg">
                </i>
                <p>Sign in with Facebook</p>
            </div>
            <div className="twitter social-buttons sign-in-social-buttons">
                <i className="fab fa-twitter fa-lg">
                </i>
                <p>Sign in with Twitter</p>
            </div>
            <p>or with email</p>
            <form onSubmit={onSignInSubmit} className="sign-up-form">
                <TextInput
                    id="sign-in-email"
                    name="email"
                    type="text"
                    placeholder="Email Address"
                    icon="far fa-envelope fa-lg"
                    handleChange={handleChange}
                    value={signInDetails.email}
                    error={signInErrors.email}
                />
                <TextInput
                    id="sign-up-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    icon="fas fa-lock fa-lg"
                    handleChange={handleChange}
                    value={signInDetails.password}
                    error={signInErrors.password}
                    showPassword={showPassword}
                    toggleShowPassword={toggleShowPassword}
                />
                <button
                    type="submit"
                    className="submit-button"
                    onClick={onSignInSubmit}
                >
                    Sign In
                </button>
            </form>
            <p className="sign-up-agreement">By signing up, you accept our
                <a> Terms of Use</a> and <a>Privacy Policy</a>
            </p>
        </section>
        <aside>
            <hr/>
            <section>
                <p className="we-voter">Don't have a WeVote account?</p>
                <div onClick={() => handleShow(SIGN_UP_MODAL)}><p>Sign up</p></div>
            </section>
        </aside>
    </div>
);

export default SignIn;
