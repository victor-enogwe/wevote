import React from 'react';

import TextInput from './TextInput';
import SelectInput from "./SelectInput";

import actionTypes from '../../actions/constants';

const { SIGN_IN_MODAL } = actionTypes;

const sexFields = {
    male: 'Male',
    female: 'Female'
};


const BioForm = ({ handleChange, userDetails, errors, goTo }) => (
    <section className="bio">
        <h2 className="bio-header"> Sign Up </h2>
        <TextInput
            id="sign-up-firstname"
            name="firstname"
            type="text"
            placeholder="First Name"
            icon="fas fa-user fa-lg"
            handleChange={handleChange}
            value={userDetails.firstname}
            error={errors.firstname}
        />
        <TextInput
            id="sign-up-surname"
            name="surname"
            type="text"
            placeholder="Surname"
            icon="fas fa-user fa-lg"
            handleChange={handleChange}
            value={userDetails.surname}
            error={errors.surname}
        />
        <TextInput
            id="sign-up-phone"
            name="phone"
            type="tel"
            placeholder="Phone Number"
            icon="fas fa-mobile-alt fa-lg"
            handleChange={handleChange}
            value={userDetails.phone}
            error={errors.phone}
        />
        <div className="sign-up-select-fields">
            <SelectInput
                id="sign-up-state"
                name="state"
                placeholder="State Of Residence"
                fields={ageFields}
                handleChange={handleChange}
                value={userDetails.state}
                error={errors.state}
            />
            <SelectInput
                id="sign-up-sex"
                name="sex"
                placeholder="Sex"
                fields={sexFields}
                handleChange={handleChange}
                value={userDetails.sex}
                error={errors.sex}
            />
        </div>
        <TextInput
            id="sign-up-email"
            name="email"
            type="email"
            placeholder="Email Address"
            icon="far fa-envelope fa-lg"
            handleChange={handleChange}
            value={userDetails.email}
            error={errors.email}
        />
    </section>
);

export default BioForm;
