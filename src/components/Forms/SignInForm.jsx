import React from 'react';

import TextInput from './TextInput';

const SignIn = ({handleHide, handleChange, signInDetails, showPassword, toggleShowPassword}) => (
    <div className="modal-section">
        <section className="inner-modal-section">
            <i onClick={handleHide} className="fas fa-times fa-lg close-modal"></i>
            <h2 className="modal-header"> Sign Up </h2>
            <div className="facebook social-buttons sign-in-social-buttons">
                <i className="fab fa-facebook fa-lg"></i>
                <p>Sign Up with Facebook</p>
            </div>
            <div className="twitter social-buttons sign-in-social-buttons">
                <i className="fab fa-twitter fa-lg"></i>
                <p>Sign Up with Twitter</p>
            </div>
            <p>or with email</p>
            <form className="sign-up-form">
                <TextInput
                    id="sign-in-email"
                    name="email"
                    type="text"
                    placeholder="Email Address"
                    icon="far fa-envelope fa-lg"
                    handleChange={handleChange}
                    value={signInDetails.email}
                />
                <TextInput
                    id="sign-up-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    icon="fas fa-lock fa-lg"
                    handleChange={handleChange}
                    value={signInDetails.password}
                    showPassword={showPassword}
                    toggleShowPassword={toggleShowPassword}
                />
                <button type="submit" className="submit-button">
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
                <p className="we-voter">Already have a WeVote account?</p>
                <div><p>Log in</p></div>
            </section>
        </aside>
    </div>
);

export default SignIn;