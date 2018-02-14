import React from 'react';

import actionTypes from '../../actions/constants';

const { SIGN_IN_MODAL } = actionTypes;

/**
 *
 * @param handleHide
 * @param handleShow
 * @param facebookAuth
 * @returns {jsx}
 */
const SignUp = ({ handleHide, handleShow, facebookAuth, twitterAuth }) => (
    <div className="modal-section">
        <section className="inner-modal-section">
            <i
                onClick={handleHide} className="fas fa-times fa-lg close-modal"
            >
            </i>
            <h2 className="modal-header"> Sign Up </h2>
            <div
                className="facebook social-buttons"
                onClick={facebookAuth}
            >
                <i
                    className="fab fa-facebook fa-lg"
                >
                </i>
                <p>Sign up with Facebook</p>
            </div>
            <div
                className="twitter social-buttons"
                onClick={twitterAuth}
            >
                <i
                    className="fab fa-twitter fa-lg"
                >
                </i>
                <p>Sign up with Twitter</p>
            </div>
            <p>or</p>
            <div
                onClick={() => handleShow('SIGN_UP_FORM')}
                className="email social-buttons"
            >
                <i
                    className="far fa-envelope fa-lg"
                >
                </i>
                <p>Sign up with Email</p>
            </div>
            <p className="sign-up-agreement">By signing up, you accept our
                <a> Terms of Use</a> and <a>Privacy Policy</a>
            </p>
        </section>
        <aside>
            <hr/>
            <section>
                <p className="we-voter">Already have a WeVote account?</p>
                <div onClick={() => handleShow(SIGN_IN_MODAL)}><p>Log in</p></div>
            </section>
        </aside>
    </div>
);

export default SignUp;
