import React from 'react';

import TextInput from './TextInput';
import SelectInput from "./SelectInput";

const sexFields = {
    male: 'Male',
    female: 'Female'
};

const ageFields = {
    age1: '17',
    age2: '18',
    age3: '25',
    age4: '36',
    age5: '40'
};

/**
 *
 * @param handleHide
 * @param handleChange
 * @param signUpDetails
 * @returns {jsx}
 */
const SignUpForm = ({ handleHide, handleChange, signUpDetails, showPassword, toggleShowPassword }) => (
    <div className="modal-section">
        <section className="inner-modal-section">
            <i onClick={handleHide} className="fas fa-times fa-lg close-modal"></i>
            <h2 className="modal-header"> Sign Up </h2>
            <form className="sign-up-form">
                <TextInput
                    id="sign-up-first-name"
                    name="first_name"
                    type="text"
                    placeholder="First Name"
                    icon="fas fa-user fa-lg"
                    handleChange={handleChange}
                    value={signUpDetails.first_name}
                />
                <TextInput
                    id="sign-up-last-name"
                    name="last_name"
                    type="text"
                    placeholder="Last Name"
                    icon="fas fa-user fa-lg"
                    handleChange={handleChange}
                    value={signUpDetails.last_name}
                />
                <TextInput
                    id="sign-up-phone-number"
                    name="phone_number"
                    type="tel"
                    placeholder="Phone Number"
                    icon="fas fa-mobile-alt fa-lg"
                    handleChange={handleChange}
                    value={signUpDetails.phone_number}
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
                <button type="submit" className="submit-button">
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