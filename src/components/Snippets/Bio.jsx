import React from 'react';
import NaijaStates from 'naija-state-local-government';

import TextInput from '../Forms/TextInput';
import SelectInput from "../Forms/SelectInput";

const sexFields = ['Male','Female'];
const states = NaijaStates.states();

const Bio = ({ handleChange, onBioSubmit, userDetails, errors }) => (
    <section className="bio">
        <div className="question">
            <p>
                Please tell us a little bit about yourself
            </p>
        </div>
        <form onSubmit={onBioSubmit} className="bio-form">
            <TextInput
                id="bio-firstname"
                name="firstname"
                type="text"
                placeholder="First Name"
                icon="fas fa-user fa-lg"
                handleChange={handleChange}
                value={userDetails.firstname}
                error={errors.firstname}
                require={true}
            />
            <TextInput
                id="bio-surname"
                name="surname"
                type="text"
                placeholder="Surname"
                icon="fas fa-user fa-lg"
                handleChange={handleChange}
                value={userDetails.surname}
                error={errors.surname}
                require={true}
            />
            <div className="sign-up-select-fields">
                <SelectInput
                    id="bio-state"
                    name="state"
                    placeholder="State Of Residence"
                    fields={states}
                    handleChange={handleChange}
                    value={userDetails.state}
                    error={errors.state}
                    require={true}
                />
                <SelectInput
                    id="bio-sex"
                    name="sex"
                    placeholder="Sex"
                    fields={sexFields}
                    handleChange={handleChange}
                    value={userDetails.sex}
                    error={errors.sex}
                />
            </div>
            <div className="date-input">
                <label htmlFor="bio-dob">Date of Birth</label>
                <input
                   id="bio-dob"
                   name="dob"
                   type="date"
                   value={userDetails.dob}
                   pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                   onChange={handleChange}
                   placeholder="Date of Birth"
                />
            </div>
            <p>Fields marked with <span>*</span> are required</p>
            <div className="options">
                <button
                    onClick={onBioSubmit}
                    type="submit"
                >
                    Continue &raquo;
                </button>
            </div>
        </form>
    </section>
);

export default Bio;
