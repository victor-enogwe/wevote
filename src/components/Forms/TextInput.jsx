import React from 'react';
import PropTypes from 'prop-types';

const TextInput = ({id, name, type, placeholder, icon, value, handleChange, showPassword, toggleShowPassword}) => (
    <div className="text-input">
        {name === "password" &&
        <button
            className="show-password"
            onClick={toggleShowPassword}>
            {showPassword ? 'HIDE' : 'SHOW'}
        </button>}
        <i className={icon}></i>
        <label htmlFor={id}>{placeholder}</label>
        <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
        />
    </div>
);

TextInput.propTypes = {
    id: PropTypes.string,
    icon: PropTypes.string,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    showPassword: PropTypes.bool,
    handleChange: PropTypes.func.isRequired,
    toggleShowPassword: PropTypes.func
};

export default TextInput;