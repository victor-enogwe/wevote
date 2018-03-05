import React from 'react';

import TextInput from '../Forms/TextInput';

const Save = ({ handleChange, onSave, userDetails, errors }) => (
    <section className="save">
        <div className="question">
            <p>
                Please fill in the fields so you can access your result the next time you visit
            </p>
        </div>
        <form onSubmit={onSave} className="bio-form">
            <TextInput
                id="save-phone"
                name="phone"
                type="tel"
                placeholder="Phone Number"
                icon="fas fa-mobile-alt fa-lg"
                handleChange={handleChange}
                value={userDetails.phone}
                error={errors.phone}
                require={true}
            />
            <TextInput
                id="save-email"
                name="email"
                type="email"
                placeholder="Email Address"
                icon="far fa-envelope fa-lg"
                handleChange={handleChange}
                value={userDetails.email}
                error={errors.email}
            />
            <p>Fields marked with <span>*</span> are required</p>
            <div className="options">
                <button
                    onClick={onSave}
                    type="submit"
                >
                    Show My Result
                </button>
            </div>
        </form>
    </section>
);

export default Save;
