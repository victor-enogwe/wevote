import React from 'react';

import TextInput from './TextInput';
import SelectInput from "./SelectInput";

import ageFields from '../../utils/ageFields';

const sexFields = {
    male: 'Male',
    female: 'Female'
};


const SignUpForm = ({ handleHide, handleChange, signUpDetails, onSignUpSubmit, showPassword, toggleShowPassword }) => (
    <div className="modal-section">
        <section className="inner-modal-section">
            <i
                onClick={handleHide}
                className="fas fa-times fa-lg close-modal"
            >
            </i>
            <h2 className="modal-header"> Sign Up </h2>
            <form onSubmit={onSignUpSubmit} className="sign-up-form">
                <TextInput
                    id="sign-up-firstname"
                    name="firstname"
                    type="text"
                    placeholder="First Name"
                    icon="fas fa-user fa-lg"
                    handleChange={handleChange}
                    value={signUpDetails.firstname}
                />
                <TextInput
                    id="sign-up-surname"
                    name="surname"
                    type="text"
                    placeholder="Surname"
                    icon="fas fa-user fa-lg"
                    handleChange={handleChange}
                    value={signUpDetails.surname}
                />
                <TextInput
                    id="sign-up-phone"
                    name="phone"
                    type="tel"
                    placeholder="Phone Number"
                    icon="fas fa-mobile-alt fa-lg"
                    handleChange={handleChange}
                    value={signUpDetails.phone}
                />
                <div className="sign-up-select-fields">
                    <SelectInput
                        id="sign-up-sex"
                        name="sex"
                        placeholder="Sex"
                        fields={sexFields}
                        handleChange={handleChange}
                        value={signUpDetails.sex}
                    />
                    <SelectInput
                        id="sign-up-age"
                        name="age"
                        placeholder="Age"
                        fields={ageFields}
                        handleChange={handleChange}
                        value={signUpDetails.age}
                    />
                </div>
                <TextInput
                    id="sign-up-email"
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    icon="far fa-envelope fa-lg"
                    handleChange={handleChange}
                    value={signUpDetails.email}
                />
                <TextInput
                    id="sign-up-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    icon="fas fa-lock fa-lg"
                    handleChange={handleChange}
                    value={signUpDetails.password}
                    showPassword={showPassword}
                    toggleShowPassword={toggleShowPassword}
                />
                <button
                    type="submit"
                    className="submit-button"
                    onClick={onSignUpSubmit}
                >
                    Sign Up
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

export default SignUpForm;
